"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import emailjs from "emailjs-com";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    emailjs
      .send(
        "service_cuj8m9n", // Replace with your EmailJS service ID
        "template_7tv9yl5", // Replace with your EmailJS template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: "prayaspal04@gmail.com" // The recipient email address
        },
        "ANBh8WX7YmuejuIRC" // Replace with your EmailJS user ID
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
        },
        (err) => {
          console.log("FAILED...", err);
        }
      );
  };

  return (
    <div className="px-4 py-8 md:py-16 bg-white dark:bg-gray-800">
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-transparent bg-clip-text">
            Contact Us
          </CardTitle>
          <CardDescription>
            We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="hover:outline-none hover:ring-2 hover:ring-purple-300 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="hover:outline-none hover:ring-2 hover:ring-purple-300 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter the subject"
                className="hover:outline-none hover:ring-2 hover:ring-purple-300 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your message"
                className="min-h-[120px] hover:outline-none hover:ring-2 hover:ring-purple-300 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
            </div>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 hover:from-purple-600 hover:via-violet-600 hover:to-pink-600 transition-all duration-300"
              >
                <span className="font-bold">Send Message</span>
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
