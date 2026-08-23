import { Component, input, computed, Input, Signal, OnInit } from '@angular/core';
import { ArrowRight, ChevronRight, LucideAngularModule, LucideIconData, X } from 'lucide-angular';

@Component({
  selector: 'app-nav-icon',
  imports: [LucideAngularModule],
  template: `
    @if (iconData()) {
      <lucide-icon [img]="iconData()!" [size]="size()" />
    }
  `,
  styles: [':host { display: inline-flex; align-items: center; justify-content: center; }'],
})
export class NavIconComponent implements OnInit {
  @Input({ required: true }) iconMap!: Record<string, LucideIconData>;

  name = input.required<string>();
  size = input(22);

  localIconMap: Record<string, LucideIconData> = {
    'chevron-right': ChevronRight,
    'arrow-right': ArrowRight,
    x: X,
  };

  iconData!: Signal<LucideIconData>;

  constructor() {}
  ngOnInit(): void {
    this.iconData = ['chevron-right', 'arrow-right', 'x'].indexOf(this.name())
      ? computed(() => this.iconMap[this.name()] ?? null)
      : computed(() => this.iconMap[this.name()] ?? null);
  }
}
