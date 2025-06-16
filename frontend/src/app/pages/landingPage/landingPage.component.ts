import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { EspecialistaService } from '../../services/especialista.service';
import { Subscription } from 'rxjs';

declare let L: any; // Declaración global para Leaflet

@Component({
  selector: 'app-landingPage',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landingPage.component.html',
  styleUrls: ['./landingPage.component.css'],
  providers: [DatePipe]
})
export class landingPage implements OnInit, AfterViewInit, OnDestroy {
  selectedDate: Date | null = null;
  currentDate = new Date();
  calendarDays: (number | null)[][] = [];
  isLoggedIn: boolean = false;
  isEspecialista: boolean = false;
  private map: any = null;
  private markerCluster: any = null;
  private fragmentSubscription: Subscription | undefined;
  private staticClinics: any[] = [];
  private leafletLoaded = false;
  userLocation: { lat: number, lng: number } | null = null;

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private authService: AuthService,
    private especialistaService: EspecialistaService,
    private route: ActivatedRoute,
    private el: ElementRef,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.http.get<any[]>('assets/mental-health-centers.json').subscribe(data => {
      this.staticClinics = data;
    });
  }

  ngOnInit() {
    this.generateCalendar(this.currentDate);
    this.checkAuthStatus();
  }

  async ngAfterViewInit(): Promise<void> {
    this.fragmentSubscription = this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => this.scrollToFragment(fragment), 100);
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      await this.loadLeaflet();
      if (!this.isEspecialista) {
        await this.getUserLocation();
        this.initMap();
      }
    }
  }

  private async loadLeaflet(): Promise<void> {
    if (this.leafletLoaded) return;

    try {
      // Carga Leaflet y sus plugins
      const leaflet = await import('leaflet');
      await import('leaflet.markercluster');

      // Solución para iconos rotos
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
        iconUrl: 'assets/leaflet/marker-icon.png',
        shadowUrl: 'assets/leaflet/marker-shadow.png'
      });

      this.leafletLoaded = true;
    } catch (err) {
      console.error('Error loading Leaflet:', err);
    }
  }

  async getUserLocation(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            resolve();
          },
          (error) => {
            console.error('Error obteniendo ubicación', error);
            this.userLocation = { lat: -17.371486977105853, lng: -66.1439330529856 };
            resolve();
          }
        );
      } else {
        console.error('Geolocation no soportada');
        this.userLocation = { lat: -17.371486977105853, lng: -66.1439330529856 };
        resolve();
      }
    });
  }

  scrollToFragment(fragment: string): void {
    try {
      const element = document.querySelector(`#${fragment}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (e) {
      console.error('landingPage: Error scrolling to fragment:', e);
    }
  }

  checkAuthStatus() {
    const usuario = this.authService.getUsuario();
    this.isLoggedIn = !!usuario;
    this.isEspecialista = usuario?.rol === 'especialista';
  }

  logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
      this.isLoggedIn = false;
      this.isEspecialista = false;
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
    }
  }

  generateCalendar(date: Date) {
    const month = date.getMonth();
    const year = date.getFullYear();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    this.calendarDays = [];
    let days: (number | null)[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(day);
      if (days.length === 7) {
        this.calendarDays.push(days);
        days = [];
      }
    }

    if (days.length > 0) {
      while (days.length < 7) {
        days.push(null);
      }
      this.calendarDays.push(days);
    }
  }

  selectDate(day: number | null) {
    if (day) {
      this.selectedDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        day
      );
    }
  }

  isSelected(day: number | null): boolean {
    return !!day && !!this.selectedDate &&
      this.selectedDate.getDate() === day &&
      this.selectedDate.getMonth() === this.currentDate.getMonth() &&
      this.selectedDate.getFullYear() === this.currentDate.getFullYear();
  }

  prevMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1
    );
    this.generateCalendar(this.currentDate);
    this.selectedDate = null;
  }

  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1
    );
    this.generateCalendar(this.currentDate);
    this.selectedDate = null;
  }

  confirmSelection(): void {
    if (this.selectedDate) {
      const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
      this.router.navigate(['/appointments'], {
        queryParams: { date: formattedDate }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.fragmentSubscription) {
      this.fragmentSubscription.unsubscribe();
    }
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  initMap(): void {
    if (!this.leafletLoaded || !window['L'] || !this.userLocation) {
      console.error('Leaflet no está disponible o no hay ubicación');
      return;
    }

    const L = window['L'];

    try {
      // Solucionar problema de iconos
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
        iconUrl: 'assets/leaflet/marker-icon.png',
        shadowUrl: 'assets/leaflet/marker-shadow.png'
      });

      this.map = L.map('map').setView([this.userLocation.lat, this.userLocation.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.markerCluster = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
      });

      // Marcador de usuario
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: '<div class="pulse-dot"></div>',
        iconSize: [20, 20]
      });

      L.marker([this.userLocation.lat, this.userLocation.lng], {icon: userIcon})
        .bindPopup('Tu ubicación')
        .addTo(this.map);

      this.findMentalHealthClinics();
    } catch (error) {
      console.error('Error inicializando mapa:', error);
    }
  }

  findMentalHealthClinics(): void {
    if (!this.userLocation) return;

    const radius = 5000; // 5 km de radio
    const overpassQuery = `
      [out:json];
      (
        node["amenity"="clinic"](around:${radius},${this.userLocation.lat},${this.userLocation.lng});
        node["healthcare"="clinic"](around:${radius},${this.userLocation.lat},${this.userLocation.lng});
        node["healthcare"="psychiatrist"](around:${radius},${this.userLocation.lat},${this.userLocation.lng});
        node["healthcare"="psychotherapist"](around:${radius},${this.userLocation.lat},${this.userLocation.lng});
        node["healthcare"="hospital"](around:${radius},${this.userLocation.lat},${this.userLocation.lng});
        node["healthcare"="mental_health"](around:${radius},${this.userLocation.lat},${this.userLocation.lng});
        node["name"~"salud mental|psiquiátrico|psicólogo|psicologo|mental health|psiquiatra",i](around:${radius},${this.userLocation.lat},${this.userLocation.lng});
      );
      out body;
      >;
      out skel qt;
    `;

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    this.http.get(overpassUrl).subscribe({
      next: (data: any) => {
        const apiClinics = data.elements || [];
        const staticClinics = this.staticClinics.map(clinic => ({
          ...clinic,
          lat: clinic.lat,
          lon: clinic.lng,
          tags: {
            name: clinic.name,
            healthcare: clinic.type,
            "contact:phone": clinic.phone,
            opening_hours: clinic.hours
          }
        }));

        const allClinics = [...apiClinics, ...staticClinics];
        this.processClinicsData(allClinics);
      },
      error: (err) => {
        console.error('Error buscando clínicas:', err);
        const staticClinics = this.staticClinics.map(clinic => ({
          ...clinic,
          lat: clinic.lat,
          lon: clinic.lng,
          tags: {
            name: clinic.name,
            healthcare: clinic.type,
            "contact:phone": clinic.phone,
            opening_hours: clinic.hours
          }
        }));
        this.processClinicsData(staticClinics);
      }
    });
  }

  processClinicsData(clinics: any[]): void {
    if (!this.map || !this.markerCluster || !window['L']) return;

    const L = window['L'];
    this.markerCluster.clearLayers();

    clinics.forEach(clinic => {
      if (clinic.lat && clinic.lon) {
        const clinicType = this.determineClinicType(clinic);
        const customIcon = this.createClinicIcon(clinicType, L);
        const marker = L.marker([clinic.lat, clinic.lon], {icon: customIcon});

        let popupContent = `<b>${clinic.tags?.name || 'Centro de Salud Mental'}</b>`;
        popupContent += `<br><em>Tipo: ${this.getClinicTypeName(clinicType)}</em>`;

        if (clinic.tags?.['contact:phone']) {
          popupContent += `<br>Teléfono: ${clinic.tags['contact:phone']}`;
        }

        if (clinic.tags?.opening_hours) {
          popupContent += `<br>Horario: ${clinic.tags.opening_hours}`;
        }

        marker.bindPopup(popupContent);
        this.markerCluster.addLayer(marker);
      }
    });

    this.map.addLayer(this.markerCluster);
    this.addMapLegend(L);
  }

  private determineClinicType(clinic: any): string {
    const tags = clinic.tags || {};

    if (tags.healthcare === 'psychiatrist') return 'psychiatrist';
    if (tags.healthcare === 'psychotherapist') return 'psychotherapist';
    if (tags.healthcare === 'mental_health') return 'mental_health';
    if (tags.healthcare === 'hospital') return 'hospital';

    const name = (tags.name || '').toLowerCase();
    if (name.includes('psiquiatr')) return 'psychiatrist';
    if (name.includes('psicolog')) return 'psychotherapist';
    if (name.includes('salud mental')) return 'mental_health';
    if (name.includes('hospital') || name.includes('hospital')) return 'hospital';

    return 'general';
  }

  private createClinicIcon(clinicType: string, L: any): any {
    const icons = {
      psychiatrist: { emoji: '🧠', color: '#FF6B6B' },
      psychotherapist: { emoji: '💬', color: '#4ECDC4' },
      mental_health: { emoji: '❤️', color: '#FFD166' },
      hospital: { emoji: '🏥', color: '#6A0572' },
      general: { emoji: '🏥', color: '#5A92C2' }
    };

    const config = icons[clinicType as keyof typeof icons] || icons.general;

    return L.divIcon({
      className: 'clinic-marker',
      html: `
        <div class="clinic-icon" style="background-color: ${config.color}">
          ${config.emoji}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  }

  private getClinicTypeName(clinicType: string): string {
    const names = {
      psychiatrist: 'Psiquiatría',
      psychotherapist: 'Psicoterapia',
      mental_health: 'Salud Mental',
      hospital: 'Hospital',
      general: 'Centro de Salud'
    };

    return (names as any)[clinicType] || 'Centro de Salud';
  }

  private addMapLegend(L: any): void {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'map-legend');
      const types = [
        { type: 'psychiatrist', name: 'Psiquiatría' },
        { type: 'psychotherapist', name: 'Psicoterapia' },
        { type: 'mental_health', name: 'Salud Mental' },
        { type: 'hospital', name: 'Hospital' },
        { type: 'general', name: 'Otros' }
      ];

      let content = '<h4>Leyenda</h4>';
      types.forEach(t => {
        const icon = this.createClinicIcon(t.type, L);
        const colorMatch = icon.options.html.match(/background-color: ([^;]+)/);
        const emojiMatch = icon.options.html.match(/>([^<]+)</);

        const color = colorMatch ? colorMatch[1] : '#5A92C2';
        const emoji = emojiMatch ? emojiMatch[1] : '🏥';

        content += `
          <div class="legend-item">
            <div class="legend-icon" style="background-color: ${color}">
              ${emoji}
            </div>
            <span>${t.name}</span>
          </div>
        `;
      });

      div.innerHTML = content;
      return div;
    };

    legend.addTo(this.map);
  }
}
