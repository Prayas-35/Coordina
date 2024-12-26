'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { GoogleGenerativeAI } from "@google/generative-ai"
import ReactMarkdown from "react-markdown"
import { Upload, FileText } from 'lucide-react'

interface AIProjectAnalyzerProps {
  projectDescription: string
}

export function AIProjectAnalyzer({ projectDescription }: AIProjectAnalyzerProps) {
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [generatedAnalysis, setGeneratedAnalysis] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [tenderAnalysis, setTenderAnalysis] = useState('')

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" })

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAdditionalInfo(e.target.value)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0])
    }
  }

  const analyzeTender = async () => {
    if (!pdfFile) {
      setTenderAnalysis("Please upload a PDF file first.")
      return
    }

    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('pdf', pdfFile)
      const response = await fetch('/api/analyzePdf', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      const pdfContent = data.content

      const prompt = `
        You are an expert in analyzing government tenders. Analyze the following tender document and provide a detailed markdown-formatted analysis. Your response must follow this structure:

        ### Tender Analysis

        #### Summary
        Provide a brief overview of the tender.

        #### Key Requirements
        List the main requirements specified in the tender.

        #### Evaluation Criteria
        Outline the criteria that will be used to evaluate submissions.

        #### Timeline
        Highlight important dates and deadlines.

        #### Potential Challenges
        Identify any potential challenges or risks for bidders.

        #### Recommendations
        Provide actionable recommendations for preparing a strong bid.

        **Tender Content:**
        ${pdfContent}
      `

      const result = await model.generateContent(prompt)
      const analysis = result.response.text().trim()
      setTenderAnalysis(analysis)
    } catch (error) {
      console.error("Failed to analyze tender", error)
      setTenderAnalysis("An error occurred while analyzing the tender. Please try again.")
    }
    setIsAnalyzing(false)
  }

  const analyzeProject = async () => {
    setIsAnalyzing(true)
    try {
      const fullDescription = `${projectDescription}\n\nAdditional Information: ${additionalInfo}\n\nTender Analysis: ${tenderAnalysis}`
      const prompt = `
          You are an expert AI analyst specializing in government projects. Analyze the following project description, extra concerns, and tender analysis, and provide a detailed markdown-formatted analysis. Your response must follow this structure and be formatted for ReactMarkdown rendering:

          ### Project Analysis

          #### Overview
          Provide a concise summary of the project, including its purpose and objectives.

          #### Key Objectives
          List the primary goals of the project.

          #### Potential Conflicts
          Identify and explain all potential conflicts that might arise during the project. This can include inter-departmental conflicts, resource allocation issues, community opposition, or legal challenges.

          #### Possible Problems
          List and elaborate on all possible problems that may occur during the project's execution. For example:
          - Environmental challenges
          - Financial constraints
          - Technical hurdles
          - Operational risks

          #### Tender Considerations
          Analyze how the project aligns with the tender requirements and evaluation criteria. Highlight any areas where the project may need adjustment to better meet the tender specifications.

          #### Extra Concerns
          Incorporate and address the extra concerns provided in the additional information tab. Discuss how these concerns might impact the project.

          #### Recommendations
          Provide actionable recommendations to mitigate the identified conflicts and problems, ensure smooth execution of the project, and improve the chances of winning the tender.

          #### Conclusion
          End with a high-level summary and emphasize the importance of addressing the concerns proactively.

          **Project Description:**
          ${fullDescription}
          `

      const result = await model.generateContent(prompt)
      const analysis = result.response.text().trim()
      setGeneratedAnalysis(analysis)
    } catch (error) {
      console.error("Failed to analyze project", error)
      setGeneratedAnalysis("An error occurred while analyzing the project. Please try again.")
    }
    setIsAnalyzing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Project Analyzer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              value={additionalInfo}
              onChange={handleInputChange}
              className="mb-2 h-32" 
              placeholder="Enter any additional information about the project here..."
            />
          </div>
          <div>
            <Label htmlFor="pdfUpload">Upload Tender PDF</Label>
            <Input
              id="pdfUpload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="mb-2 bg-blue-900 justify-center"
            />
          </div>
          <Button onClick={analyzeTender} disabled={isAnalyzing || !pdfFile} className="w-full">
            {isAnalyzing ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Analyzing Tender...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Analyze Tender
              </>
            )}
          </Button>
          {tenderAnalysis && (
            <div>
              <Label>Tender Analysis</Label>
              <div className="border rounded-md p-4 overflow-y-auto bg-background h-60">
                <ReactMarkdown className="text-sm">{tenderAnalysis}</ReactMarkdown>
              </div>
            </div>
          )}
          <Button onClick={analyzeProject} disabled={isAnalyzing} className="w-full">
            {isAnalyzing ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Analyzing Project...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Analyze Project
              </>
            )}
          </Button>
          <div>
            <Label htmlFor="generatedAnalysis">AI-Generated Project Analysis</Label>
            <div className="relative">
              <div className="border rounded-md p-4 overflow-y-auto bg-background h-90">
                <ReactMarkdown className="text-sm">{generatedAnalysis}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

