import React from "react";
import Layout from "../../components/layout/Layout";

export default function Help() {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Help & Support</h1>

      <p className="mb-4 text-gray-600">
        Here you can find answers to frequently asked questions and useful information
        about using the Support Ticket System.
      </p>

      <ul className="list-disc ml-6 space-y-2">
        <li>How to create a ticket</li>
        <li>How to track your ticket progress</li>
        <li>How to contact support</li>
        <li>Understanding ticket status</li>
      </ul>
    </>
  );
}
