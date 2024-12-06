'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function GoalsWidget() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">goal tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">daily meditation</span>
            <span className="text-sm text-muted-foreground">15/20 mins</span>
          </div>
          <Progress value={75} />
          <p className="text-xs text-muted-foreground">🔥 5 day streak!</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">hydrate!</span>
            <span className="text-sm text-muted-foreground">96/128 oz</span>
          </div>
          <Progress value={75} />
          <p className="text-xs text-muted-foreground">🎯 Almost there!</p>
        </div>
      </CardContent>
    </Card>
  );
}
