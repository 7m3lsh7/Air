"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, TrendingUp, Target, Zap } from "lucide-react"

export function ModelComparison() {
  const models = [
    {
      name: "Linear Regression",
      icon: TrendingUp,
      status: "Active",
      accuracy: "65-75%",
      speed: "Fast",
      description: "Simple trend-based forecasting",
      pros: ["Fast computation", "Easy to interpret", "Good for short-term"],
      cons: ["Limited accuracy", "Assumes linear trends", "No seasonality"],
    },
    {
      name: "ARIMA",
      icon: Target,
      status: "Recommended",
      accuracy: "75-85%",
      speed: "Medium",
      description: "Time series analysis with seasonality",
      pros: ["Handles seasonality", "Better accuracy", "Proven method"],
      cons: ["Slower computation", "Requires tuning", "More complex"],
    },
    {
      name: "LSTM Neural Network",
      icon: Brain,
      status: "Advanced",
      accuracy: "85-95%",
      speed: "Slow",
      description: "Deep learning for complex patterns",
      pros: ["Highest accuracy", "Learns patterns", "Handles non-linearity"],
      cons: ["Requires training data", "Computationally expensive", "Black box"],
    },
  ]

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          ML Model Comparison
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Available forecasting algorithms and their characteristics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {models.map((model, index) => {
            const Icon = model.icon
            return (
              <div key={index} className="p-4 bg-secondary rounded-lg border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{model.name}</h3>
                      <p className="text-xs text-muted-foreground">{model.description}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      model.status === "Active"
                        ? "bg-green-500/20 text-green-400"
                        : model.status === "Recommended"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {model.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                    <p className="text-sm font-medium text-foreground">{model.accuracy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Speed</p>
                    <p className="text-sm font-medium text-foreground">{model.speed}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Complexity</p>
                    <p className="text-sm font-medium text-foreground">
                      {index === 0 ? "Low" : index === 1 ? "Medium" : "High"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-green-400 font-medium mb-1">Pros:</p>
                    <ul className="space-y-0.5 text-muted-foreground">
                      {model.pros.map((pro, i) => (
                        <li key={i}>• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-red-400 font-medium mb-1">Cons:</p>
                    <ul className="space-y-0.5 text-muted-foreground">
                      {model.cons.map((con, i) => (
                        <li key={i}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-xs text-foreground">
            <strong>Production Recommendation:</strong> For a production system, implement an ensemble approach
            combining ARIMA for trend analysis and LSTM for pattern recognition, with real-time model selection based on
            recent accuracy metrics.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
