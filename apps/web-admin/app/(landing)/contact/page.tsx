export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-12">
          Have questions? We&apos;d love to hear from you. Send us a message and
          we&apos;ll respond as soon as possible.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
            >
              Send Message
            </button>
          </form>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">info@schoolms.com</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">+254 700 000 000</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-600">
                Nairobi, Kenya
                <br />
                Upper Hill, Riverside Drive
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Office Hours</h3>
              <p className="text-gray-600">
                Monday &ndash; Friday: 8:00 AM &ndash; 5:00 PM
                <br />
                Saturday: 9:00 AM &ndash; 1:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
