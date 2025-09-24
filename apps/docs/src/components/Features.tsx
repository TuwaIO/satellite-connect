export function Features({ features }: { features: { title: string; icon: string; description: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {features.map((feature) => (
        <div key={feature.title} className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <div className="text-2xl mb-3">{feature.icon}</div>
          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
