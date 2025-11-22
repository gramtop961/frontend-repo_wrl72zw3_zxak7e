import Spline from '@splinetool/react-spline'

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-50/60 to-white" />
      </div>
      <div className="container mx-auto px-6 py-16 md:py-24 relative">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
              SV Adult Health NP PC
            </h1>
            <p className="mt-4 text-slate-600 text-lg">
              Secure online payments for visits and procedures. Pay quickly with card, Apple Pay, or Google Pay.
            </p>
          </div>
          <div className="h-[320px] md:h-[420px] rounded-xl overflow-hidden shadow-2xl ring-1 ring-blue-100/50">
            <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero