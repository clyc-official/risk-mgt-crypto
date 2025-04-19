import axios from "axios"

const SYMBOLS = [
    "BTCUSDT"
]
const CATEGORY = 'spot' // linear

async function main() {
    try{
        let result: {
            symbol: string,
            volume: string
        }[] = []

        for(const symbol of SYMBOLS) {
            const volume = await get24hVolume(symbol)

            result.push({
                symbol: symbol,
                volume: volume
            })
        }

        console.log(result)

        process.exit(0)
    }
    catch(err){
        console.error(err)
        process.exit(1)
    }
}

main()

async function get24hVolume(symbol: string) {
    const res = await axios.get(`https://api.bybit.com/v5/market/tickers?category=${CATEGORY}&symbol=${symbol}`)

    return res.data.result.list[0].volume24h as string
}