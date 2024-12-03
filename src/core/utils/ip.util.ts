import geoip from 'geoip-lite';

export interface GeoLocationDetails {
    country: string | null;
    region: string | null;
    city: string | null;
    latitude: number | null;
    longitude: number | null;
    timezone: string | null;
    ipAddress: string;
}

export function hasIpChanged(currentIp: string, storedIp: string): boolean {
    const currentIpGeo = geoip.lookup(currentIp);
    const storedIpGeo = geoip.lookup(storedIp);

    if (currentIpGeo && storedIpGeo) {
        const isDifferentCountry = currentIpGeo.country !== storedIpGeo.country;
        const isDifferentCity = currentIpGeo.city !== storedIpGeo.city;

        if (isDifferentCountry || isDifferentCity) {
            return true;
        }
    }

    return false;
}

export function getGeolocationDetails(ipAddress: string): GeoLocationDetails | null {
    const geoData = geoip.lookup(ipAddress);

    if (geoData) {
        return {
            country: geoData.country || null,
            region: geoData.region || null,
            city: geoData.city || null,
            latitude: geoData.ll ? geoData.ll[0] : null,
            longitude: geoData.ll ? geoData.ll[1] : null,
            timezone: geoData.timezone || null,
            ipAddress: ipAddress,
        };
    }

    return null;
}

