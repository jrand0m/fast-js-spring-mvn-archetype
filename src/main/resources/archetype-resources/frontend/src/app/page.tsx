import ItemList from '@/components/ItemList';
import ItemProcessor from '@/components/ItemProcessor';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Item List Section */}
        <section>
          <ItemList />
        </section>

        {/* Item Processor Section */}
        <section>
          <ItemProcessor />
        </section>
      </div>
    </main>
  );
}
