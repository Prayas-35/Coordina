"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function Contact() {
  return (
    <div className="px-4 py-8 md:py-16 bg-white dark:bg-gray-800">
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-transparent bg-clip-text">
            Contact Us
          </CardTitle>
          <CardDescription>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                placeholder="Enter your name" 
                className="hover:outline-none hover:ring-2 hover:ring-purple-300 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                className="hover:outline-none hover:ring-2 hover:ring-purple-300 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject" 
                placeholder="Enter the subject" 
                className="hover:outline-none hover:ring-2 hover:ring-purple-300 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                placeholder="Enter your message" 
                className="min-h-[120px] hover:outline-none hover:ring-2 hover:ring-purple-300 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 hover:from-purple-600 hover:via-violet-600 hover:to-pink-600 transition-all duration-300">
            <span className="font-bold">Send Message</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}