import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, CreditCard, Shield, ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/settings/')({ 
  component: RouteComponent,
})

const settingsCards = [
  {
    title: 'Profile Settings',
    description: 'Manage your profile information, avatar, and personal details',
    icon: <User className="h-8 w-8 text-primary" />,
    href: '/settings/profile',
    buttonText: 'Manage Profile'
  },
  {
    title: 'Payment History',
    description: 'View your payment history and manage billing information',
    icon: <CreditCard className="h-8 w-8 text-primary" />,
    href: '/settings/payment',
    buttonText: 'View Payments'
  },
  {
    title: 'Security',
    description: 'Change your password and manage account security',
    icon: <Shield className="h-8 w-8 text-primary" />,
    href: '/settings/profile',
    buttonText: 'Security Settings'
  }
]

function RouteComponent() {
  return (
    <div className="w-full space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {settingsCards.map((card) => (
            <Card key={card.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  {card.icon}
                  <div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to={card.href}>
                  <Button className="w-full" variant="outline">
                    {card.buttonText}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}