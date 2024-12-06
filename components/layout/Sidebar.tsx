'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Activity, BookOpen, FileText, Mic, ImagePlus, Apple, Home } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navigation = [
  { name: 'main', href: '/', icon: Home },
  { name: 'schedule', href: '/calendar', icon: Calendar },
  { name: 'fitness', href: '/fitness', icon: Activity },
  { name: 'food', href: '/nutrition', icon: Apple },
  { name: 'corpus', href: '/library', icon: BookOpen },
  // { name: 'journal', href: '/journal', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleEntryClick = (type: string) => {
    console.log('Adding entry:', type);
    // Add your entry handling logic here
  };

  return (
    <div className="flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-background">
      <div className="flex flex-col items-center space-y-2 p-6">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/images/aura-profile.jpg" />
          <AvatarFallback>SA</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="font-semibold">RACHEL TOMASETTI</h2>
          <p className="text-sm text-muted-foreground">Day 14 of 28</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 mt-6">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground',
                pathname === item.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="relative w-full h-28 my-2 flex items-center justify-center">
        <Image
          src="/images/flower.png"
          alt=""
          width={200}
          height={200}
          className="opacity-40 absolute -bottom-10"
        />
      </div>

      <div className="p-4 mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              Add Entry
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleEntryClick('photo')}>
              <ImagePlus className="mr-2 h-4 w-4" />
              <span>Photo/Video</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEntryClick('audio')}>
              <Mic className="mr-2 h-4 w-4" />
              <span>Audio</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEntryClick('note')}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Note</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
