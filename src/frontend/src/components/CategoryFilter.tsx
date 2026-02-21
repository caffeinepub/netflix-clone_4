import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

const categories = ['Movies', 'Series', 'Documentaries', 'Animation', 'Comedy', 'Sci-Fi'];

interface CategoryFilterProps {
  activeCategory?: string;
}

export default function CategoryFilter({ activeCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Link key={category} to="/category/$categoryName" params={{ categoryName: category }}>
          <Button
            variant={activeCategory === category ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
          >
            {category}
          </Button>
        </Link>
      ))}
    </div>
  );
}
