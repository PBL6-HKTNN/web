import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, ArrowRight } from "lucide-react";

export function EmptyCart() {
  return (
    <Card className="border-none shadow-2xl bg-card overflow-hidden">
      <CardContent className="p-20 text-center space-y-8">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto border-4 border-background shadow-xl">
            <ShoppingBag className="h-16 w-16 text-primary" />
          </div>
        </div>

        <div className="space-y-3 max-w-md mx-auto">
          <h2 className="text-4xl font-black tracking-tight">
            Your cart is empty
          </h2>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            Looks like you haven't added any courses yet. Start your learning
            journey today!
          </p>
        </div>

        <Link to="/course" className="inline-block">
          <Button
            size="lg"
            className="h-14 px-10 text-lg font-black rounded-full shadow-xl shadow-primary/20 group"
          >
            Browse Courses
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
