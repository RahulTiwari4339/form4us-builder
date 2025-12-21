export default function DesignModel({
designSettings,
setShowDesignPanel,
setDesignSettings
}){

    return (
          <div className="fixed top-0 right-0 w-[360px] h-full bg-gray-50 shadow-2xl z-50 overflow-y-auto border-l border-gray-200">

          {/* Header with close button */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
            <h2 className="text-base font-medium text-gray-900">Design Settings</h2>
            <button
              className="text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowDesignPanel(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Color Picker Item */}
            {[
              { label: 'Background', key: 'backgroundColor', hex: designSettings.backgroundColor },
              { label: 'Questions', key: 'textColor', hex: designSettings.textColor },
              { label: 'Answers', key: 'textColor', hex: designSettings.textColor },
              { label: 'Buttons', key: 'buttonColor', hex: designSettings.buttonColor },
              { label: 'Button Text', key: 'buttonTextColor', hex: designSettings.buttonTextColor },
              { label: 'Star Rating', key: 'buttonColor', hex: designSettings.buttonColor }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">{item.label}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={item.hex}
                    readOnly
                    className="w-24 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-600"
                  />
                  <div className="relative">
                    <input
                      type="color"
                      value={item.hex}
                      onChange={(e) => {
                        if (item.key === 'backgroundColor') {
                          setDesignSettings((p) => ({ ...p, backgroundColor: e.target.value }));
                        } else if (item.key === 'textColor') {
                          setDesignSettings((p) => ({ ...p, textColor: e.target.value }));
                        } else if (item.key === 'buttonColor') {
                          setDesignSettings((p) => ({ ...p, buttonColor: e.target.value }));
                        } else if (item.key === 'buttonTextColor') {
                          setDesignSettings((p) => ({ ...p, buttonTextColor: e.target.value }));
                        }
                      }}
                      className="w-10 h-10 rounded-md cursor-pointer border-2 border-gray-300"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Note */}
            <div className="bg-gray-100 rounded-md p-3 text-xs text-gray-600">
              <strong>Note:</strong> Any changes made in the Design tab will be saved & published automatically.
            </div>

            {/* Alignment */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <label className="text-sm font-medium text-gray-700">Alignment</label>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 p-3 bg-white border-2 border-gray-300 rounded-md hover:border-gray-400">
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button className="flex-1 p-3 bg-white border-2 border-gray-300 rounded-md hover:border-gray-400">
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Font */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Font</label>
                <button className="text-sm text-blue-600 hover:text-blue-700">+ Custom font</button>
              </div>
              <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700">
                <option>Inter</option>
              </select>
            </div>

            {/* Background Image */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-3">Background Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white hover:border-gray-400 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="bg-image"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setDesignSettings((p) => ({ ...p, backgroundImage: url }));
                  }}
                />
                <label htmlFor="bg-image" className="cursor-pointer">
                  {designSettings.backgroundImage ? (
                    <img
                      src={designSettings.backgroundImage}
                      className="max-h-32 mx-auto rounded-md"
                      alt="Background preview"
                    />
                  ) : (
                    <div>
                      <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-500">Select image</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
    )
}