PROJECT_PATH="{your project path}"
ENVIRONMENT=devnet
PROXY=https://devnet-api.elrond.com
CHAIN=D

OWNER="{path to your pem file}"
OPERATOR="{path to pem file}"
OPERATOR_ID="{operator erd address}"

ADDRESS=$(mxpy data load --key=address-${ENVIRONMENT})
DEPLOY_TRANSACTION=$(mxpy data load --key=deployTransaction-${ENVIRONMENT})

VESTED_TOKEN_ID=XXXXXX # token-id hex value

address_to_hex() {
    echo "0x$(mxpy wallet bech32 --decode "$1")"
}

deploy() {
    
    echo "${PROJECT_PATH}"

    mxpy --verbose contract deploy --recall-nonce --pem="${OWNER}" --gas-limit=150000000 \
    --bytecode="${PROJECT_PATH}"/output/vesting.wasm \
    --arguments 0x${VESTED_TOKEN_ID} \
    --send --outfile="deploy-${ENVIRONMENT}.interaction.json" --proxy=${PROXY} --chain=${CHAIN} || return

    TRANSACTION=$(mxpy data parse --file="deploy-${ENVIRONMENT}.interaction.json" --expression="data['emittedTransactionHash']")
    ADDRESS=$(mxpy data parse --file="deploy-${ENVIRONMENT}.interaction.json" --expression="data['contractAddress']")

    mxpy data store --key=address-${ENVIRONMENT} --value="${ADDRESS}"
    mxpy data store --key=deployTransaction-${ENVIRONMENT} --value="${TRANSACTION}"

    echo ""
    echo "Smart contract address: ${ADDRESS}"
}
upgrade() {
    mxpy --verbose contract upgrade ${ADDRESS} --recall-nonce \
        --bytecode="${PROJECT_PATH}"/output/vesting.wasm \
        --pem=${OWNER} \
        --gas-limit=60000000 \
        --proxy=${PROXY} --chain=${CHAIN} \
        --arguments 0x${VESTED_TOKEN_ID} \
        --send || return
}

#------------------------------------------ OPERATOR ---------------------------------------
set_operator_address_from_config(){
    mxpy --verbose contract call "${ADDRESS}" --recall-nonce --pem="${OWNER}" --gas-limit=15000000 \
            --value 0 --function="set_operator_address" --arguments "$(address_to_hex "${OPERATOR_ID}")"\
            --send --proxy=${PROXY} --chain=${CHAIN}
}

set_operator_address(){
    mxpy --verbose contract call "${ADDRESS}" --recall-nonce --pem="${OWNER}" --gas-limit=15000000 \
            --value 0 --function="set_operator_address" --arguments "$(address_to_hex "$1")"\
            --send --proxy=${PROXY} --chain=${CHAIN}
}

clear_operator_address(){
    mxpy --verbose contract call "${ADDRESS}" --recall-nonce --pem="${OWNER}" --gas-limit=15000000 \
            --value 0 --function="clear_operator_address" \
            --send --proxy=${PROXY} --chain=${CHAIN}
}
#------------------------------------------ OPERATOR ---------------------------------------

#------------------------------------------ FREEZE ---------------------------------------
frozen() {
    mxpy --verbose contract query "${ADDRESS}" --function="frozen" --proxy=${PROXY}
}
#TODO
#------------------------------------------ FREEZE ---------------------------------------

#------------------------------------------ ALLOWED TOKEN ---------------------------------------
get_vested_token(){
    mxpy --verbose contract query "${ADDRESS}" --function="get_vested_token" --proxy=${PROXY}
}

set_vested_token() {
    mxpy --verbose contract call "${ADDRESS}" --recall-nonce --pem="${OWNER}" --gas-limit=15000000 \
            --value 0 --function="set_vested_token" --arguments 0x"$1"\
            --send --proxy=${PROXY} --chain=${CHAIN}
}
#------------------------------------------ ALLOWED TOKEN ---------------------------------------

#------------------------------------------ INITIAL EPOCH ---------------------------------------
get_listing_epoch(){
    mxpy --verbose contract query "${ADDRESS}" --function="get_listing_epoch" --proxy=${PROXY}
}
set_listing_epoch() {
    mxpy --verbose contract call "${ADDRESS}" --recall-nonce --pem="${OWNER}" --gas-limit=15000000 \
            --value 0 --function="set_listing_epoch" --arguments "$1"\
            --send --proxy=${PROXY} --chain=${CHAIN}
}
#------------------------------------------ INITIAL EPOCH ---------------------------------------

#------------------------------------------ CATEGORY ---------------------------------------
get_categories(){
    mxpy --verbose contract query "${ADDRESS}" --function="get_categories" --proxy=${PROXY}
}

configure_category() {
    mxpy --verbose contract call "${ADDRESS}" --recall-nonce --pem="${OWNER}" --gas-limit=15000000 \
            --value 0 --function="configure_category" --arguments "$@"\
            --send --proxy=${PROXY} --chain=${CHAIN}
}

remove_category() {
    mxpy --verbose contract call "${ADDRESS}" --recall-nonce --pem="${OWNER}" --gas-limit=15000000 \
            --value 0 --function="remove_category" --arguments "$1"\
            --send --proxy=${PROXY} --chain=${CHAIN}
}

get_unlock_data_list(){
    mxpy --verbose contract query "${ADDRESS}" --function="get_unlock_data_list" --arguments "$1" --proxy=${PROXY}
}

#------------------------------------------ CATEGORY ---------------------------------------

#------------------------------------------ ADDRESS LIST ---------------------------------------
get_category_addresses(){
    mxpy --verbose contract query "${ADDRESS}" --function="get_category_addresses" --arguments "$1" --proxy=${PROXY}
}

set_address_balance() {
    mxpy --verbose contract call "${ADDRESS}" --recall-nonce --pem="${OWNER}" --gas-limit=600000000 \
            --value 0 --function="set_address_balance" --arguments "$@"\
            --send --proxy=${PROXY} --chain=${CHAIN}
}

remove_address_from_category() {
    mxpy --verbose contract call "${ADDRESS}" --recall-nonce --pem="${OWNER}" --gas-limit=15000000 \
            --value 0 --function="remove_address_from_category" --arguments "$1" "$(address_to_hex "$2")"\
            --send --proxy=${PROXY} --chain=${CHAIN}
}

get_category_address_balance(){
    mxpy --verbose contract query "${ADDRESS}" --function="get_category_address_balance" --arguments "$1" "$(address_to_hex "$2")" --proxy=${PROXY}
}

alice_claim(){
        mxpy --verbose contract call "${ADDRESS}" --recall-nonce --pem="${ALICE}" --gas-limit=15000000 \
            --value 0 --function="claim" \
            --send --proxy=${PROXY} --chain=${CHAIN}
}

multi_alice_claim(){
        mxpy --verbose contract call "${ADDRESS}"  --nonce=8 --pem="${ALICE}" --gas-limit=15000000 \
            --value 0 --function="claim" \
            --send --proxy=${PROXY} --chain=${CHAIN}

        mxpy --verbose contract call "${ADDRESS}"  --nonce=11 --pem="${ALICE}" --gas-limit=15000000 \
            --value 0 --function="claim" \
            --send --proxy=${PROXY} --chain=${CHAIN}
}

mark_claim(){
        mxpy --verbose contract call "${ADDRESS}" --recall-nonce --pem="${MARK}" --gas-limit=15000000 \
            --value 0 --function="claim" \
            --send --proxy=${PROXY} --chain=${CHAIN}
}


charlie_claim(){
        mxpy --verbose contract call "${ADDRESS}" --recall-nonce --pem="${CHARLIE}" --gas-limit=15000000 \
            --value 0 --function="claim" \
            --send --proxy=${PROXY} --chain=${CHAIN}
}

multi_mark_claim(){
        mxpy --verbose contract call "${ADDRESS}" --nonce=10 --pem="${MARK}" --gas-limit=15000000 \
            --value 0 --function="claim" \
            --send --proxy=${PROXY} --chain=${CHAIN}
        mxpy --verbose contract call "${ADDRESS}" --nonce=11 --pem="${MARK}" --gas-limit=15000000 \
            --value 0 --function="claim" \
            --send --proxy=${PROXY} --chain=${CHAIN}
        mxpy --verbose contract call "${ADDRESS}" --nonce=12 --pem="${MARK}" --gas-limit=15000000 \
            --value 0 --function="claim" \
            --send --proxy=${PROXY} --chain=${CHAIN}
        mxpy --verbose contract call "${ADDRESS}" --nonce=13 --pem="${MARK}" --gas-limit=15000000 \
            --value 0 --function="claim" \
            --send --proxy=${PROXY} --chain=${CHAIN}
}

multi_charlie_claim(){
        mxpy --verbose contract call "${ADDRESS}" --nonce=0 --pem="${CHARLIE}" --gas-limit=15000000 \
            --value 0 --function="claim" \
            --send --proxy=${PROXY} --chain=${CHAIN}
        mxpy --verbose contract call "${ADDRESS}" --nonce=1 --pem="${CHARLIE}" --gas-limit=15000000 \
            --value 0 --function="claim" \
            --send --proxy=${PROXY} --chain=${CHAIN}
        mxpy --verbose contract call "${ADDRESS}" --nonce=2 --pem="${CHARLIE}" --gas-limit=15000000 \
            --value 0 --function="claim" \
            --send --proxy=${PROXY} --chain=${CHAIN}
        mxpy --verbose contract call "${ADDRESS}" --nonce=3 --pem="${CHARLIE}" --gas-limit=15000000 \
            --value 0 --function="claim" \
            --send --proxy=${PROXY} --chain=${CHAIN}
}

john_claim(){
        mxpy --verbose contract call "${ADDRESS}" --recall-nonce --pem="${JOHN}" --gas-limit=15000000 \
            --value 0 --function="claim" \
            --send --proxy=${PROXY} --chain=${CHAIN}
}

get_address_balance(){
    mxpy --verbose contract query "${ADDRESS}" --function="get_address_balance" --arguments "$(address_to_hex "$1")" --proxy=${PROXY}
}

#------------------------------------------ ADDRESS LIST ---------------------------------------

#------------------------------------------ FUNDS ---------------------------------------
add_funds() {
    mxpy --verbose contract call "${ADDRESS}" --recall-nonce --pem="${OWNER}" --gas-limit=15000000 \
            --value 0 --function="ESDTTransfer" --arguments 0x${VESTED_TOKEN_ID} "$1" 0x6164645f66756e6473 \
            --send --proxy=${PROXY} --chain=${CHAIN}
}


#------------------------------------------ FUNDS ---------------------------------------



