export default function Footer() {
  return <footer className="relative py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-evenly gap-8">
          <div className="w-[40%] md:w-auto">
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://appsbunny.com" className="text-muted-foreground hover:text-foreground">
                  AppsBunny
                </a>
              </li>
              <li>
                <a href="https://nextbunny.co/projects" className="text-muted-foreground hover:text-foreground">
                  Next.js Drag & Drop Editor
                </a>
              </li>
            </ul>
          </div>
          <div className="w-[40%] md:w-auto">
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://appsbunny.com/about-us" className="text-muted-foreground hover:text-foreground">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div className="w-[40%] md:w-auto">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://appsbunny.com/privacy-policy" className="text-muted-foreground hover:text-foreground">
                  Privacy
                </a>
              </li>
              <li>
                <a href="https://appsbunny.com/terms" className="text-muted-foreground hover:text-foreground">
                  Terms
                </a>
              </li>
              <li>
                <a href="https://appsbunny.com/cookie-policy" className="text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
          <div className="w-[40%] md:w-auto">
            <h3 className="text-lg font-semibold mb-4">Nextjs Components</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://nextbunny.co/nextbunny-components" className="text-muted-foreground hover:text-foreground">
                  Components
                </a>
              </li>
              <li>
                <a href="https://nextbunny.co/templates" className="text-muted-foreground hover:text-foreground">
                  Templates
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} NeuroLens. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
}