"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { UploadCloud, File, Type, FileText, ShieldCheck, AlertTriangle } from "lucide-react"

interface AnalysisResult {
  "File Name": string
  "File Type": string
  "File Description": string
  "Key Findings": string
  "PII Removed"?: string
}

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to analyze.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setResult(null)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze_file/", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Analysis failed")
      }

      const data: AnalysisResult = await response.json()
      setResult(data)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderFinding = (finding: string) => {
    const [key, ...valueParts] = finding.split(":")
    const value = valueParts.join(":")
    return (
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
        <div>
          <span className="font-semibold text-primary">{key}:</span>
          <span className="ml-2 text-muted-foreground">{value}</span>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl">
            OptivSec Analysis Engine
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Upload a file to perform a deep security and content analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          <Card className="bg-card/50 backdrop-blur-lg md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="h-6 w-6" />
                Upload File
              </CardTitle>
              <CardDescription>
                Select a file from your device to begin analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                onChange={handleFileChange}
                className="text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
              />
              <Button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Analyzing..." : "Analyze File"}
              </Button>
            </CardContent>
          </Card>

          <div className="md:col-span-3">
            {isLoading && (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border bg-card/30 p-8">
                <div className="text-center">
                  <div className="animate-pulse text-primary">Analyzing...</div>
                  <p className="text-sm text-muted-foreground">
                    Please wait while the engine processes your file.
                  </p>
                </div>
              </div>
            )}

            {result && (
              <Card className="bg-card/50 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="w-1/4 font-medium py-4"><File className="mr-2 inline h-4 w-4" />File Name</TableCell>
                        <TableCell className="py-4">{result["File Name"]}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium py-4"><Type className="mr-2 inline h-4 w-4" />File Type</TableCell>
                        <TableCell className="py-4">{result["File Type"]}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium py-4"><FileText className="mr-2 inline h-4 w-4" />Description</TableCell>
                        <TableCell className="text-muted-foreground whitespace-pre-wrap break-words py-4">{result["File Description"]}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium py-4"><ShieldCheck className="mr-2 inline h-4 w-4" />PII Removed</TableCell>
                        <TableCell className="py-4">{result["PII Removed"]}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="align-top font-medium py-4"><AlertTriangle className="mr-2 inline h-4 w-4" />Key Findings</TableCell>
                        <TableCell className="space-y-2 py-4">
                          {result["Key Findings"]
                            .split(";")
                            .map((finding, i) => (
                              <div key={i}>{renderFinding(finding.trim())}</div>
                            ))}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
