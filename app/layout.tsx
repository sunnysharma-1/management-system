import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AXIS - HRM & Employee Management System',
  description: 'Comprehensive Human Resource Management and Employee Management System with Billing, Requirements, and Advanced Modules',
  generator: 'v0.app',
  openGraph: {
    title: 'AXIS - HRM & Employee Management System',
    description: 'Complete HRM solution for enterprise resource planning',
  }
}

import { AuthProvider } from '@/components/providers/auth-context'
import { MasterDataProvider } from '@/components/providers/master-data-context'
import { BillingProvider } from '@/components/providers/billing-context'
import { EmployeeProvider } from '@/components/providers/employee-context'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <MasterDataProvider>
          <BillingProvider>
            <EmployeeProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </EmployeeProvider>
          </BillingProvider>
        </MasterDataProvider>
      </body>
    </html>
  )
}
