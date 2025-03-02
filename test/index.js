const should = require('should')
const { BittrexClient } = require('../src')
require('dotenv').config()

const client = new BittrexClient({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET
})

describe('bittrex v3 api', () => {
  describe('# account', () => {
    it('should get account', async () => {
      let results = await client.account()
      should.exist(results.accountId)
    })

    it('should get account fees trading', async () => {
      let results = await client.accountFeesTrading()
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get account fees trading w/ market symbol', async () => {
      let results = await client.accountFeesTrading('BTC-USD')
      should.exist(results.marketSymbol)
    })

    it('should get account volume', async () => {
      let results = await client.accountVolume()
      should.exist(results.volume30days)
    })

    it('should get account permissions markets', async () => {
      let results = await client.accountPermissionsMarkets()
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get account permissions markets w/ marketSymbol', async () => {
      let results = await client.accountPermissionsMarkets('BTC-USD')
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get account permissions currencies', async () => {
      let results = await client.accountPermissionsCurrencies()
      results.length.should.be.aboveOrEqual(0)
      should.exist(results[0].symbol)
    })

    it('should get account permissions currencies w/ marketSymbol', async () => {
      let results = await client.accountPermissionsCurrencies('BTC')
      results.length.should.be.aboveOrEqual(0)
      results[0].symbol.should.be.equals('BTC')
    })

  })

  describe('# addresses', () => {
    it('should get addresses', async () => {
      let results = await client.addresses()
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get addresses w/ marketSymbol', async () => {
      let results = await client.addresses('BTC')
      results.currencySymbol.should.be.equals('BTC')
    })

    it('should get address status', async () => {
      let results = await client.addressStatus('BTC')
      results.currencySymbol.should.be.equals('BTC')
    })

    it('should request provisioning of a new deposit address for a given currency', async () => {
      try {
        let results = await client.addressCreate('BTC')
        results.status.should.be.equals("REQUESTED")
      } catch (err) {
        err.message.should.be.equals("CRYPTO_ADDRESS_ALREADY_EXISTS")
      }
    })
  })

  describe('# balances', () => {
    it('should get balances', async () => {
      let results = await client.balances()
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get specific balance', async () => {
      let results = await client.balance('BTC')
      results.currencySymbol.should.be.equals('BTC')
    })

    it('should get sequence of balances snapshot', async () => {
      await client.headBalances()
    })
  })

  describe('# batch', () => {
    it('should create batch', async () => {
      try {
        await client.batch()
      } catch (err) {
        err.message.should.be.equals("REQUEST_NOT_PROCESSED")
      }
    })
  })

  describe('# conditional orders', () => {
    it('should get conditional order by id', async () => {
      try {
        await client.conditionalOrders('00000000-0000-4000-b000-000000000000')
      } catch (err) {
        err.message.should.be.equals("NOT_FOUND")
      }
    })

    it('should delete conditional order', async () => {
      try {
        await client.conditionalOrderDelete('00000000-0000-4000-b000-000000000000')
      } catch (err) {
        err.message.should.be.equals("INVALID_ORDER")
      }
    })

    it('should get closed conditional orders', async () => {
      let results = await client.conditionalOrdersClosed()
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get open conditional orders', async () => {
      let results = await client.conditionalOrdersOpen()
      results.length.should.be.aboveOrEqual(0)
    })

    it('should head open conditional orders', async () => {
      await client.headConditionalOrdersOpen()
    })

    it('should create new conditional order', async () => {
      try {
        await client.conditionalOrdersCreate()
      } catch (err) {
        err.message.should.be.equals("REQUEST_NOT_PROCESSED")
      }
    })
  })

  describe('# currencies', () => {
    it('should get currencies', async () => {
      let results = await client.currencies()
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get currencies w/ marketSymbol', async () => {
      let results = await client.currencies('BTC')
      results.symbol.should.be.equals('BTC')
    })
  })

  describe('# deposits', () => {
    it('should get open deposits', async () => {
      let results = await client.depositsOpen()
      results.length.should.be.aboveOrEqual(0)
    })

    it('should head open deposits', async () => {
      await client.headDepositsOpen()
    })

    it('should get closed deposits', async () => {
      let results = await client.depositsClosed()
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get deposits by tx id', async () => {
      let results = await client.depositsByTxId()
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get deposit by id', async () => {
      try {
        await client.deposits('00000000-0000-4000-b000-000000000000')
      } catch (err) {
        err.message.should.be.equals("NOT_FOUND")
      }
    })
  })

  describe('# executions', () => {
    it('should get all execution', async () => {
      let results = await client.executions()
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get filtered execution', async () => {
      let results = await client.executions({
        marketSymbol: 'BTC-EUR'
      })
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get execution by id', async () => {
      try {
        const customExecutionId = '00000000-0000-4000-b000-000000000000'
        let results = await client.executions(customExecutionId)
        results.id.should.be.equals(customExecutionId)
      } catch (err) {
        err.message.should.be.equals("NOT_FOUND")
      }
    })

    it('should get last execution', async () => {
      let results = await client.executionLastId()
      results.lastId.should.be.not.null()
    })

    it('should head last execution', async () => {
      await client.headExecutionLastId()
    })
  })

  describe('# fund transfer methods', () => {
    it('should get fund transfer method', async () => {
      try {
        const customFundTransferId = '00000000-0000-4000-b000-000000000000'
        let results = await client.fundsTransferMethods(customFundTransferId)
        results.id.should.be.equals(customFundTransferId)
      } catch (err) {
        err.message.should.be.equals("INVALID_ADDRESS")
      }
    })
  })

  describe('# markets', () => {
    it('should get all markets', async () => {
      let results = await client.markets()
      results.length.should.be.aboveOrEqual(0)
    })
    it('should get all markets summaries', async () => {
      let results = await client.marketsSummaries()
      results.length.should.be.aboveOrEqual(0)
    })
    it('should head market summaries', async () => {
      await client.headMarketsSummaries()
    })
    it('should get all markets tickers', async () => {
      let results = await client.marketsTickers()
      results.length.should.be.aboveOrEqual(0)
    })
    it('should head market tickers', async () => {
      await client.headMarketsTickers()
    })
    it('should get market ticker by symbol', async () => {
      let results = await client.marketTicker('BTC-EUR')
      results.symbol.should.be.equals('BTC-EUR')
    })

    it('should get market by symbol', async () => {
      let results = await client.market('BTC-EUR')
      results.symbol.should.be.equals('BTC-EUR')
    })

    it('should get market summary by symbol', async () => {
      let results = await client.marketSummary('BTC-EUR')
      results.symbol.should.be.equals('BTC-EUR')
    })

    it('should get market order book by symbol', async () => {
      let results = await client.marketOrderBook('BTC-EUR')
      results.bid.length.should.be.aboveOrEqual(0)
    })

    it('should get market order book by symbol + 1 depth', async () => {
      let results = await client.marketOrderBook('BTC-EUR', 1)
      results.bid.length.should.be.equals(1)
    })

    it('should get market order book by symbol + 25 depth', async () => {
      let results = await client.marketOrderBook('BTC-EUR', 25)
      results.bid.length.should.be.equals(25)
    })

    it('should get market order book by symbol + 500 depth', async () => {
      let results = await client.marketOrderBook('BTC-EUR', 500)
      results.bid.length.should.be.equals(500)
    })

    it('should get market order book by symbol + invalid depth', async () => {
      let results = await client.marketOrderBook('BTC-EUR', 2).catch(() => null)
      try {
        should(results).be.exactly(null)
      } catch (err) {
        throw Error('Invalid depth got valid response')
      }
    })

    it('should head market order book', async () => {
      await client.headMarketOrderBook()
    })

    it('should get market trades by symbol', async () => {
      let results = await client.marketTrades('BTC-EUR')
      results.length.should.be.aboveOrEqual(0)
    })

    it('should head market trades by symbol', async () => {
      await client.headMarketTrades('BTC-EUR')
    })

    it('should get market candles by symbol + 1 day + w/out candle type', async () => {
      let results = await client.marketCandles('BTC-EUR', 'DAY_1')
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get market candles by symbol + 1 day + candle type TRADE', async () => {
      let results = await client.marketCandles('BTC-EUR', 'DAY_1', 'TRADE')
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get market candles by symbol + 1 day + candle type MIDPOINT', async () => {
      let results = await client.marketCandles('BTC-EUR', 'DAY_1', 'MIDPOINT')
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get market candles by symbol + 1 hour', async () => {
      let results = await client.marketCandles('BTC-EUR', 'HOUR_1')
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get market candles by symbol + 5 minutes', async () => {
      let results = await client.marketCandles('BTC-EUR', 'MINUTE_5')
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get market candles by symbol + 1 minute', async () => {
      let results = await client.marketCandles('BTC-EUR', 'MINUTE_1')
      results.length.should.be.aboveOrEqual(0)
    })

    it('should head candles by symbol w/out candle type', async () => {
      await client.headMarketCandles('BTC-EUR', 'MINUTE_1')
    })

    it('should head candles by symbol w/ candle type', async () => {
      await client.headMarketCandles('BTC-EUR', 'MINUTE_1', 'MIDPOINT')
    })

    it('should get market candles by year', async () => {
      let results = await client.marketCandlesDate('BTC-EUR', 'DAY_1', 2020)
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get market candles by year + month', async () => {
      let results = await client.marketCandlesDate('BTC-EUR', 'HOUR_1', 2020, 'MIDPOINT', 10)
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get market candles by year + month + day', async () => {
      let results1 = await client.marketCandlesDate('BTC-EUR', 'MINUTE_5', 2020, 'MIDPOINT', 10, 2)
      let results2 = await client.marketCandlesDate('BTC-EUR', 'MINUTE_1', 2020, 'MIDPOINT', 10, 2)
      results1.length.should.be.aboveOrEqual(0)
      results2.length.should.be.aboveOrEqual(0)
    })
  })

  describe('# orders', () => {
    it('should get orders closed', async () => {
      let results = await client.ordersClosed()
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get orders closed by marketSymbol', async () => {
      let results = await client.ordersClosed({ marketSymbol: 'BTC-EUR' })
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get orders open', async () => {
      let results = await client.ordersOpen()
      results.length.should.be.aboveOrEqual(0)
    })

    it('should delete open orders', async () => {
      // WARNING: Don't make tests delete your orders.
      // To test the endpoint, expect at least a wrong market symbol
      try {
        await client.ordersDelete('XXX-XXX')
      } catch (err) {
        err.message.should.be.equals("MARKET_DOES_NOT_EXIST")
      }
    })

    it('should head open orders', async () => {
      await client.headOrdersOpen()
    })

    it('should get order by id', async () => {
      try {
        await client.order('00000000-0000-4000-b000-000000000000')
      } catch (err) {
        err.message.should.be.equals("NOT_FOUND")
      }
    })

    it('should delete order by id', async () => {
      try {
        await client.orderDelete('00000000-0000-4000-b000-000000000000')
      } catch (err) {
        err.message.should.be.equals("ORDER_DOES_NOT_EXIST")
      }
    })

    it('should get order executions', async () => {
      try {
        await client.ordersExecutions('00000000-0000-4000-b000-0000000000')
      } catch (err) {
        err.message.should.be.equals("NOT_FOUND")
      }
    })

    it('should create order', async () => {
      // WARNING: In order to avoid tests creating real orders,
      // use REQUIRED params (or you will get a BAD_REQUEST)
      // and place a wrong marketSymbol to receive MARKET_DOES_NOT_EXIST
      try {
        await client.orderCreate({
          type: 'market',
          direction: 'sell',
          timeInForce: 'buy_now',
          marketSymbol: 'XXX-XXX'
        })
      } catch (err) {
        err.message.should.be.equals("MARKET_DOES_NOT_EXIST")
      }
    })

  })

  describe('# ping', () => {
    it('should ping', async () => {
      let results = await client.ping()
      results.serverTime.should.be.Number()
    })
  })

  describe('# subaccounts', () => {
    it('should get all subaccount', async () => {
      try {
        await client.subaccounts()
      } catch (err) {
        err.message.should.be.equals("INVALID_PERMISSION")
      }
    })

    it('should get subaccount by id', async () => {
      try {
        await client.subaccounts('00000000-0000-4000-b000-000000000000')
      } catch (err) {
        err.message.should.be.equals("INVALID_PERMISSION")
      }
    })

    it('should create new subaccount', async () => {
      try {
        await client.subaccountCreate({})
      } catch (err) {
        err.message.should.be.equals("INVALID_PERMISSION")
      }
    })

    it('should get subaccount open withdrawals', async () => {
      let results = await client.subaccountWithdrawalsOpen()
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get subaccount closed withdrawals', async () => {
      let results = await client.subaccountWithdrawalsClosed()
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get subaccount closed deposits', async () => {
      let results = await client.subaccountsDepositsClosed()
      results.length.should.be.aboveOrEqual(0)
    })
  })

  describe('# transfers', () => {
    it('should list sent transfers', async () => {
      try {
        let results = await client.transfersSent()
        results.length.should.be.aboveOrEqual(0)
      } catch (err) {
        err.message.should.be.equals("INVALID_PERMISSION")
      }
    })

    it('should list received transfers', async () => {
      try {
        let results = await client.transfersReceived()
        results.length.should.be.aboveOrEqual(0)
      } catch (err) {
        err.message.should.be.equals("INVALID_PERMISSION")
      }
    })

    it('should get transfer by id', async () => {
      try {
        let results = await client.transfer('00000000-0000-4000-b000-000000000000')
        results.id.should.be.equals('00000000-0000-4000-b000-000000000000')
      } catch (err) {
        err.message.should.be.equals("INVALID_PERMISSION")
      }
    })

    it('should create a new transfer', async () => {
      try {
        let results = await client.transferCreate({ currencySymbol: 'XXX' })
        results.id.should.be.equals('00000000-0000-4000-b000-000000000000')
      } catch (err) {
        err.message.should.be.equals("INVALID_PERMISSION")
      }
    })
  })

  describe('# withdraws', () => {
    it('should list open withdrawals', async () => {
      let results = await client.withdrawalsOpen()
      results.length.should.be.aboveOrEqual(0)
    })

    it('should list closed withdrawals', async () => {
      let results = await client.withdrawalsClosed()
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get withdrawal by transaction id', async () => {
      let results = await client.withdrawalByTxId('00000000-0000-4000-b000-000000000000')
      results.length.should.be.aboveOrEqual(0)
    })

    it('should get withdrawal by id', async () => {
      try {
        let results = await client.withdrawal('00000000-0000-4000-b000-000000000000')
        results.id.should.be.equals('00000000-0000-4000-b000-000000000000')
      } catch (err) {
        err.message.should.be.equals("NOT_FOUND")
      }
    })

    it('should delete withdrawal by id', async () => {
      try {
        await client.withdrawalDelete('00000000-0000-4000-b000-000000000000')
      } catch (err) {
        err.message.should.be.equals("INVALID_WITHDRAWAL")
      }
    })

    it('should create new withdrawal', async () => {
      try {
        await client.withdrawalCreate({ currencySymbol: 'XXX', quantity: 1 })
      } catch (err) {
        err.message.should.be.equals("BAD_REQUEST")
      }
    })

    it('should get withdrawal allowed addresses', async () => {
      let results = await client.withdrawalsAllowedAddresses()
      results.length.should.be.aboveOrEqual(0)
    })
  })

})
