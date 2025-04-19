import { Category, Prisma, PrismaClient } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"
import axios from "axios"

type Orderbook = [string, string][]

async function main() {
    try{
        const db = getPrismaClient()
        const inputs = await getInputs(db)

        for(const input of inputs) {
            console.log(`Fetching orderbook for ${input.symbol} (${input.category})`)
            const orderbook = await getOrderbook(input.category, input.symbol)

            const asks = getLimitedOrderbook(input.numberOfNear.toNumber(), orderbook.asks)
            const bids = getLimitedOrderbook(input.numberOfNear.toNumber(), orderbook.bids)

            const asksFirstValidation = isFirstValidationFailed(input.numberOfNear, input.numberOfFar, orderbook.asks.length)
            const bidsFirstValidation = isFirstValidationFailed(input.numberOfNear, input.numberOfFar, orderbook.bids.length)

            if(asksFirstValidation) {
                throw new Error("First validation failed due to numberOfNear + numberOfFar > asksLength")
            }
            if(bidsFirstValidation) {
                throw new Error("First validation failed due to numberOfNear + numberOfFar > bidsLength")
            }

            const asksSecondValidation = isSecondValidationFailed(input.numberOfNear, orderbook.asks.length)
            const bidsSecondValidation = isSecondValidationFailed(input.numberOfNear, orderbook.bids.length)

            if(asksSecondValidation) {
                throw new Error("Second validation failed due to numberOfNear < asksLength")
            }
            if(bidsSecondValidation) {
                throw new Error("Second validation failed due to numberOfNear < bidsLength")
            }

            const asksCumVolume = getCumulativeVolume(asks)
            const bidsCumVolume = getCumulativeVolume(bids)
            const volumeAvg = getAverage(asksCumVolume, bidsCumVolume)

            const asksPriceChangePercent = getPriceChangeFromOrderbook(asks)
            const bidsPriceChangePercent = getPriceChangeFromOrderbook(bids)
            const priceChangePercentAvg = getAverage(asksPriceChangePercent, bidsPriceChangePercent)

            const farOrderTotalVolume = getFarOrderTotalVolume(volumeAvg, priceChangePercentAvg, input.percenatageOfFar.toNumber(), input.percentageOfNear.toNumber())
            const eachOrderAverage = getEachOrderAverage(farOrderTotalVolume, input.numberOfFar.toNumber())
            const farDownRange = getRangeFar(eachOrderAverage, input.devidedDownRatio.toNumber())
            const farUpRange = getRangeFar(eachOrderAverage, input.devidedUpRatio.toNumber())            

            console.log(`Saving orderbook for ${input.symbol} (${input.category})`)
            await saveOutput(db, {
                symbol: input.symbol,
                category: input.category,
                devidedDownRatio: input.devidedDownRatio.toNumber(),
                devidedUpRatio: input.devidedUpRatio.toNumber(),
                percentageOfFar: input.percenatageOfFar.toNumber(),
                percentageOfNear: input.percentageOfNear.toNumber(),
                eachOrderAverage: eachOrderAverage,
                farDownRange: farDownRange,
                farOrderTotalVolume: farOrderTotalVolume,
                farUpRange: farUpRange,
                numberOfFar: input.numberOfFar.toNumber(),
                numberOfNear: input.numberOfNear.toNumber()
            })
        }

        process.exit(0)
    }
    catch(err) {
        console.error(err)
        process.exit(1)
    }
}

main()

function getPrismaClient() {
    return new PrismaClient()
}

async function getInputs(db: PrismaClient) {
    return await db.inputs.findMany({
        select: {
            symbol: true,
            category: true,
            numberOfNear: true,
            numberOfFar: true,
            percenatageOfFar: true,
            percentageOfNear: true,
            devidedDownRatio: true,
            devidedUpRatio: true
        }
    })
}

async function getOrderbook(category: Category, symbol: string) {
    try{
        const res = await axios.get(`https://api.bybit.com/v5/market/orderbook?category=${category === Category.Spot? 'spot': 'linear'}&symbol=${symbol}&limit=10000`)
        const data = res.data as {
            retCode: number;
            retMsg: string;
            result: {
              s: string;
              a: Orderbook;
              b: Orderbook;
              ts: number;
              u: number;
              seq: number;
              cts: number;
            };
            retExtInfo: Record<string, never>;
            time: number;
        }

        if(data.retCode != 0) {
            throw new Error()
        }

        return {
            asks: data.result.a,
            bids: data.result.b
        }
    } catch(err) {
        throw new Error(`Can't get orderbook for '${symbol}'`)
    }
}

function getLimitedOrderbook(limit: number, orderbook: Orderbook) {
    if (limit < 0 || !orderbook || orderbook.length === 0) {
        return [];
    }

    if (limit >= orderbook.length) {
        return [];
    }

    return orderbook.slice(limit);
}

function getCumulativeVolume(orderbook: Orderbook) {
    let cumulativeVol = "0";

    for (const [_, volume] of orderbook) {
        cumulativeVol = (parseFloat(cumulativeVol) + parseFloat(volume)).toString();
    }

    return cumulativeVol;
}

function getPriceChangeFromOrderbook(orderbook: Orderbook) {
    if (orderbook.length < 2) return "0";
    
    const firstPrice = parseFloat(orderbook[0][0]);
    const lastPrice = parseFloat(orderbook[orderbook.length - 1][0]);
    
    if (isNaN(firstPrice) || isNaN(lastPrice)) return "0"
    if (firstPrice === 0) return "0"
    
    return ((Math.abs(lastPrice - firstPrice) / firstPrice) * 100).toString();
}

function getAverage(rhs: string, lhs: string) {
    return ((parseFloat(rhs) + parseFloat(lhs))/2).toString();
}

function getFarOrderTotalVolume(volumeAvg: string, priceChangePercentAvg: string, percentageOfFar: number, percentageOfNear: number) {
    return (percentageOfFar * parseFloat(volumeAvg) / parseFloat(priceChangePercentAvg) * percentageOfNear).toString()
}

function getEachOrderAverage(farOrderTotalVolume: string, numberOfFar: number) {
    return (parseFloat(farOrderTotalVolume)/numberOfFar).toString()
}

function getRangeFar(eachOrderAverage: string, devideBy: number) {
    return (parseFloat(eachOrderAverage) * devideBy).toString()
}

function isFirstValidationFailed(numberOfNear: Decimal, numberOfFar: Decimal, ordersLength: number) {
    if(numberOfNear.add(numberOfFar).gt(ordersLength)) {
        return true
    }

    return false
}

function isSecondValidationFailed(numberOfNear: Decimal, ordersLength: number) {
    if(numberOfNear.gt(ordersLength)) {
        return true
    }

    return false
}

async function saveOutput(db: PrismaClient, data: {
    symbol: string,
    category: Category,
    devidedDownRatio: number,
    devidedUpRatio: number,
    numberOfFar: number,
    numberOfNear: number,
    percentageOfFar: number,
    percentageOfNear: number
    eachOrderAverage: string
    farDownRange: string,
    farUpRange: string,
    farOrderTotalVolume: string
}) {
    const found = await db.outputs.findFirst({
        where: {
            symbol: data.symbol,
            category: data.category,
        },
        select: {
            id: true
        }
    })

    if(found) {
        await db.outputs.update({
            where: {
                id: found.id
            },
            data: {
                devidedDownRatio: data.devidedDownRatio,
                devidedUpRatio: data.devidedUpRatio,
                numberOfFar: data.numberOfFar,
                numberOfNear: data.numberOfNear,
                eachOrderAverage: data.eachOrderAverage,
                farDownRange: data.farDownRange,
                farUpRange: data.farUpRange,
                farOrderTotalVolume: data.farOrderTotalVolume,
            }
        })
    } else {
        await db.outputs.create({
            data: {
                symbol: data.symbol,
                category: data.category,
                devidedDownRatio: data.devidedDownRatio,
                devidedUpRatio: data.devidedUpRatio,
                numberOfFar: data.numberOfFar,
                numberOfNear: data.numberOfNear,
                percenatageOfFar: data.percentageOfFar,
                percentageOfNear: data.percentageOfNear,
                eachOrderAverage: data.eachOrderAverage,
                farDownRange: data.farDownRange,
                farUpRange: data.farUpRange,
                farOrderTotalVolume: data.farOrderTotalVolume,
            }
        })
    }
}