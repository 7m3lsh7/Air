// Machine Learning utilities for air quality forecasting

export interface ForecastModel {
  slope: number
  intercept: number
  r2Score: number
  mae: number
}

export interface ForecastResult {
  predictions: Array<{
    timestamp: string
    hour: number
    pm25: number
    no2: number
    o3: number
    confidence: number
  }>
  models: {
    pm25: ForecastModel
    no2: ForecastModel
    o3: ForecastModel
  }
  accuracy: number
}

/**
 * Simple linear regression with performance metrics
 */
export function linearRegressionWithMetrics(x: number[], y: number[]): ForecastModel {
  const n = x.length
  let sumX = 0
  let sumY = 0
  let sumXY = 0
  let sumXX = 0

  for (let i = 0; i < n; i++) {
    sumX += x[i]
    sumY += y[i]
    sumXY += x[i] * y[i]
    sumXX += x[i] * x[i]
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  // Calculate R² score
  const yMean = sumY / n
  let ssTotal = 0
  let ssResidual = 0

  for (let i = 0; i < n; i++) {
    const yPred = slope * x[i] + intercept
    ssTotal += Math.pow(y[i] - yMean, 2)
    ssResidual += Math.pow(y[i] - yPred, 2)
  }

  const r2Score = 1 - ssResidual / ssTotal

  // Calculate Mean Absolute Error
  let sumAbsError = 0
  for (let i = 0; i < n; i++) {
    const yPred = slope * x[i] + intercept
    sumAbsError += Math.abs(y[i] - yPred)
  }
  const mae = sumAbsError / n

  return {
    slope,
    intercept,
    r2Score: Math.max(0, Math.min(1, r2Score)), // Clamp between 0 and 1
    mae,
  }
}

/**
 * Calculate confidence interval for predictions
 */
export function calculateConfidence(model: ForecastModel, futureIndex: number, dataLength: number): number {
  // Confidence decreases as we predict further into the future
  const distanceFactor = Math.max(0, 1 - futureIndex / (dataLength * 2))
  // Confidence based on model accuracy (R² score)
  const accuracyFactor = model.r2Score
  // Combined confidence score
  return Math.round(distanceFactor * accuracyFactor * 100)
}

/**
 * Enhanced forecasting with multiple algorithms
 */
export function generateEnhancedForecast(
  historicalData: Array<{ pm25: number; no2: number; o3: number }>,
  hours = 24,
): ForecastResult {
  const x = historicalData.map((_, index) => index)
  const yPM25 = historicalData.map((d) => d.pm25 || 0)
  const yNO2 = historicalData.map((d) => d.no2 || 0)
  const yO3 = historicalData.map((d) => d.o3 || 0)

  // Build models
  const pm25Model = linearRegressionWithMetrics(x, yPM25)
  const no2Model = linearRegressionWithMetrics(x, yNO2)
  const o3Model = linearRegressionWithMetrics(x, yO3)

  // Generate predictions
  const predictions = []
  const lastIndex = x.length - 1
  const now = new Date()

  for (let i = 1; i <= hours; i++) {
    const futureIndex = lastIndex + i
    const forecastTime = new Date(now.getTime() + i * 60 * 60 * 1000)

    const pm25Pred = Math.max(0, Math.round(pm25Model.slope * futureIndex + pm25Model.intercept))
    const no2Pred = Math.max(0, Math.round(no2Model.slope * futureIndex + no2Model.intercept))
    const o3Pred = Math.max(0, Math.round(o3Model.slope * futureIndex + o3Model.intercept))

    // Calculate average confidence
    const avgConfidence = Math.round(
      (calculateConfidence(pm25Model, i, x.length) +
        calculateConfidence(no2Model, i, x.length) +
        calculateConfidence(o3Model, i, x.length)) /
        3,
    )

    predictions.push({
      timestamp: forecastTime.toISOString(),
      hour: i,
      pm25: pm25Pred,
      no2: no2Pred,
      o3: o3Pred,
      confidence: avgConfidence,
    })
  }

  // Calculate overall accuracy
  const avgR2 = (pm25Model.r2Score + no2Model.r2Score + o3Model.r2Score) / 3
  const accuracy = Math.round(avgR2 * 100)

  return {
    predictions,
    models: {
      pm25: pm25Model,
      no2: no2Model,
      o3: o3Model,
    },
    accuracy,
  }
}

/**
 * Moving average smoothing for noisy data
 */
export function movingAverage(data: number[], windowSize = 3): number[] {
  const result: number[] = []

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2))
    const end = Math.min(data.length, i + Math.ceil(windowSize / 2))
    const window = data.slice(start, end)
    const avg = window.reduce((sum, val) => sum + val, 0) / window.length
    result.push(avg)
  }

  return result
}
