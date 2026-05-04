import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface NominatimResult {
  lat: string;
  lon: string;
}

interface OsrmResponse {
  routes: { distance: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class DistanceService {
  // This is using open source services to turn addresses into coords and calculate distance
  private http = inject(HttpClient);

  private async geocode(address: string): Promise<{ lat: number; lon: number } | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
    const results = await firstValueFrom(
      this.http.get<NominatimResult[]>(url, {
        headers: { 'User-Agent': 'RestaurantSite/1.0 (sample project)' },
      })
    );
    if (!results?.length) return null;
    return { lat: parseFloat(results[0].lat), lon: parseFloat(results[0].lon) };
  }

  // Returns driving distance in miles, or null if either address could not be geocoded.
  async estimateDistanceMiles(fromAddress: string, toAddress: string): Promise<number | null> {
    const [from, to] = await Promise.all([
      this.geocode(fromAddress),
      this.geocode(toAddress),
    ]);
    if (!from || !to) return null;

    const url = `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=false`;
    const result = await firstValueFrom(this.http.get<OsrmResponse>(url));
    if (!result?.routes?.[0]?.distance) return null;

    return result.routes[0].distance / 1609.344;
  }
}
