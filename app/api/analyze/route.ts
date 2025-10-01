import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Create a new FormData to forward to the Python backend
    const backendFormData = new FormData()
    backendFormData.append("file", file)

    // Forward the request to the Python backend
    // Replace with your actual backend URL
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000/analyze"

    const response = await fetch(backendUrl, {
      method: "POST",
      body: backendFormData,
    })

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to analyze file",
        details: "Please ensure the backend service is running and accessible",
      },
      { status: 500 },
    )
  }
}
