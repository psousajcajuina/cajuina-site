<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  import icon from 'leaflet/dist/images/marker-icon.png';
  import iconShadow from 'leaflet/dist/images/marker-shadow.png';
  import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
  import type { Distribuidor } from '@/types';

  export let distribuidores: Distribuidor[] = [
    {
      id: 1,
      nome: 'Nome do distribuidor',
      endereco: 'Endereço do distribuidor',
      telefone: '(00) 00000-0000',
      lat: -7.2139,
      lng: -39.3158,
    },
    {
      id: 2,
      nome: 'Nome do distribuidor',
      endereco: 'Endereço do distribuidor',
      telefone: '(00) 00000-0000',
      lat: -7.205,
      lng: -39.31,
    },
    {
      id: 3,
      nome: 'Nome do distribuidor',
      endereco: 'Endereço do distribuidor',
      telefone: '(00) 00000-0000',
      lat: -7.22,
      lng: -39.32,
    },
  ];

  let mapElement: HTMLDivElement;
  let map: L.Map | null = null;
  let searchValue = '';

  onMount(() => {
    const DefaultIcon = L.icon({
      iconUrl: icon.src,
      iconRetinaUrl: iconRetina.src,
      shadowUrl: iconShadow.src,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    // Inicializa o mapa
    map = L.map(mapElement).setView([-7.225188, -39.329687], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Adiciona marcadores
    distribuidores.forEach((dist) => {
      L.marker([dist.lat, dist.lng]).addTo(map!).bindPopup(`
        <strong>${dist.nome}</strong><br>
        ${dist.endereco}<br>
        ${dist.telefone}
      `);
    });

    // Ajusta zoom
    if (distribuidores.length > 0) {
      const group = L.featureGroup(
        distribuidores.map((dist) => L.marker([dist.lat, dist.lng]))
      );
      map.fitBounds(group.getBounds().pad(0.1));
    }
  });

  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });

  function handleSearch(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      console.log('Buscar:', searchValue);
    }
  }
</script>

<section class="w-full h-[521px]">
  <!-- Título -->
  <div class="mt-8 mb-4">
    <h4 class="font-bold text-xxs scale-95 text-caju-heading-primary uppercase">
      NOS ENCONTRE PERTO DE VOCÊ
    </h4>
  </div>

  <!-- Mapa -->
  <div bind:this={mapElement} class="h-[237px] w-full md:h-[500px] z-0"></div>

  <!-- Busca -->
  <div class="flex justify-center p-2 my-2">
    <div class="w-full">
      <div class="relative">
        <input
          type="text"
          bind:value={searchValue}
          on:keypress={handleSearch}
          placeholder="Digite sua localização"
          class="w-full rounded-full bg-gray-100 px-12 py-4 text-md text-gray-800 placeholder-gray-500 focus:ring-2 focus:caret-caju-success-hover focus:outline-none"
        />
        <svg
          class="absolute top-1/2 left-4 h-6 w-6 -translate-y-1/2 transform text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          width="48"
          height="48"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  </div>

  <!-- Cards de distribuidores -->
  <div
    class="flex justify-center snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide h-[107px]"
  >
    {#each distribuidores as dist (dist.id)}
      <div
        class="[&_p]:text-[#454545] w-[225px] font-medium font-inter shrink-0 snap-start rounded-lg border-2 border-gray-200 bg-[#D9D9D9] py-3 px-4"
      >
        <h6 class="font-bold text-base text-caju-heading-primary mb-1!">
          {dist.nome}
        </h6>
        <p>{dist.endereco}</p>
        <p>{dist.telefone}</p>
      </div>
    {/each}
  </div>

  <!-- Botões -->
  <div
    class="relative flex mx-auto max-w-7xl justify-center gap-3 [&_button]:font-inter! [&_button]:font-medium! [&_button]:h-[45px] [&_button]:text-[12px]"
  >
    <button class="btn-green w-[117px]"> Ver Mais </button>
    <button class="btn-yellow w-[239px]"> Seja um Distribuidor </button>
  </div>
</section>

<style>
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
