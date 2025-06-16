import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CallToAction() {
  return (
    <section className="py-16 bg-green-600">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white mb-4">Ready to Explore Tembaro?</h2>
        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
          Start planning your unforgettable journey to one of Ethiopia's most beautiful and culturally rich
          destinations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/plan-visit">
            <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
              Plan Your Visit
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-lg"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
