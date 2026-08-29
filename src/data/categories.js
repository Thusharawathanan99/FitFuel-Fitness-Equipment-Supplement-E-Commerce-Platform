/** Category taxonomy. `art` maps to a key in components/product/ProductArt. */
export const CATEGORIES = [
  { slug: 'dumbbells',   name: 'Dumbbells',          group: 'equipment',  art: 'dumbbell'   },
  { slug: 'kettlebells', name: 'Kettlebells',        group: 'equipment',  art: 'kettlebell' },
  { slug: 'barbells',    name: 'Barbells & Plates',  group: 'equipment',  art: 'barbell'    },
  { slug: 'racks',       name: 'Racks & Rigs',       group: 'equipment',  art: 'rack'       },
  { slug: 'benches',     name: 'Benches',            group: 'equipment',  art: 'bench'      },
  { slug: 'cardio',      name: 'Cardio',             group: 'equipment',  art: 'treadmill'  },
  { slug: 'accessories', name: 'Accessories',        group: 'equipment',  art: 'belt'       },
  { slug: 'protein',     name: 'Protein',            group: 'supplement', art: 'tub'        },
  { slug: 'creatine',    name: 'Creatine',           group: 'supplement', art: 'creatine'   },
  { slug: 'preworkout',  name: 'Pre-Workout',        group: 'supplement', art: 'preworkout' },
  { slug: 'vitamins',    name: 'Vitamins',           group: 'supplement', art: 'bottle'     },
  { slug: 'recovery',    name: 'Recovery',           group: 'supplement', art: 'shaker'     },
  { slug: 'snacks',      name: 'Snacks',             group: 'supplement', art: 'bar'        }
];

export const GROUPS = {
  equipment: { slug: 'equipment', name: 'Fitness Equipment' },
  supplement: { slug: 'supplements', name: 'Supplements' }
};

export const categoryBySlug = (slug) => CATEGORIES.find((c) => c.slug === slug);
export const categoriesInGroup = (group) => CATEGORIES.filter((c) => c.group === group);
