"use client";
import { useState } from "react";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactMap() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const storeLocation = {
    address: `SETEC Institute, No. 86A, Street 110, Russian Federation Blvd (110), Phnom Penh`,
    coordinates: { lat: 34.0522, lng: -118.2437 },
  };

  const handleGetDirections = () => {
    if (!navigator.geolocation) {
    //   alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const origin = `${userLat},${userLng}`;
        const destination = encodeURIComponent(storeLocation.address);

        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
        window.open(googleMapsUrl, "_blank");
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your current location.");
      }
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-pink-100/50 overflow-hidden">
      <div className="p-6 border-b border-pink-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Find Our Store
            </h3>
            <p className="text-gray-600 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-pink-500" />
              {storeLocation.address}
            </p>
          </div>
          <Button
            onClick={handleGetDirections}
            className="bg-pink-500 hover:bg-pink-600 text-white flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Directions
          </Button>
        </div>
      </div>

      {/* Interactive Map Placeholder */}
      <div className="relative h-80 bg-gradient-to-br from-pink-50 to-rose-50">
        {!isMapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-pink-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Interactive Map
              </h4>
              <p className="text-gray-600 mb-4">
                Click to load the interactive map
              </p>
              <Button
                onClick={() => setIsMapLoaded(true)}
                variant="outline"
                className="border-pink-300 text-pink-600 hover:bg-pink-50"
              >
                Load Map
              </Button>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0">
            {/* Embedded Google Maps */}
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3537.236400477771!2d104.88986057604598!3d11.568091314809639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31095173761d4a53%3A0xcd09ff2f4d326e3f!2sSETEC%20Institute!5e1!3m2!1sen!2skh!4v1754116212358!5m2!1sen!2skh`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PKT Store Location"
            />
          </div>
        )}
      </div>

      {/* Map Footer */}
      <div className="p-4 bg-gray-50 border-t border-pink-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Store Location</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGetDirections}
            className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Open in Maps
          </Button>
        </div>
      </div>
    </div>
  );
}
