import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';

export function TodoList() {
  const router = useRouter();

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
  });

  const handleDoubleClick = () => {
    router.push('/calendar');
  };

  return (
    <Card className="w-full" onDoubleClick={handleDoubleClick}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">TO DO {currentDate}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="morning" />
          <label
            htmlFor="morning"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            CIM385 final assignment
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="morning" />
          <label
            htmlFor="morning"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            REL161 final
          </label>
        </div>
        {/* Rest of your checkboxes */}
      </CardContent>
    </Card>
  );
}
