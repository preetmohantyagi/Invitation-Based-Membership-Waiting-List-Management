function ProcessStep({ number, title, description }) {
  return (
    <div className="group p-8 rounded-2xl border border-gray-200 bg-white hover:border-gray-400 hover:shadow-xl transition-all duration-300">
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-900 text-sm font-bold group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
        {number}
      </span>

      <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">{title}</h3>

      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

export default ProcessStep;
a