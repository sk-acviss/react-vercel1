import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { geoPath } from "d3-geo";
import indiaGeojson from "./mygeodata_merged.json";
import { useActivityStore } from "@store/activityStore";

interface BubbleData {
  city: string;
  latitude: number;
  longitude: number;
  radius: number;
  state: string;
}

const IndiaBubbleMap: React.FC = () => {
  const [activeCircle, setActiveCircle] = useState<BubbleData | null>(null);
  const realTimeScansData = useActivityStore(
    (state) => state.realTimeScansData
  );
  const uniqueCities = realTimeScansData?.data
    ?.filter((e) => e.location !== null)
    .map((e) => e.location)
    .map((e) => {
      const lat = parseInt(e?.lat);
      const lon = parseInt(e?.lon);

      return lat !== 0 && lon !== 0
        ? {
            city: e?.address?.city || e?.address?.state,
            state: e?.address?.state,
            latitude: e?.lat,
            longitude: e?.lon,
          }
        : null;
    })
    .filter((f): f is BubbleData => f !== null)
    .reduce((acc: BubbleData[], city) => {
      const existingCity = acc.find((c) => c.city === city.city);
      if (existingCity) {
        existingCity.radius += 1;
      } else {
        acc.push({ ...city, radius: 1 });
      }

      return acc;
    }, [])
    .filter((e) => e.city);

  useEffect(() => {
    if (uniqueCities) {
      // const jsonString = JSON.stringify(
      //   realTimeScansData?.data
      //     ?.filter((e) => e.location?.address?.city === "Dhaka")
      //     .map((e) => e.created_on),
      //   null,
      //   2
      // );

      // // Copy JSON string to clipboard
      // navigator.clipboard
      //   .writeText(jsonString)
      //   .then(() => console.log("Array copied to clipboard"))
      //   .catch((err) => console.error("Unable to copy to clipboard:", err));
      const indiaElement = document.querySelector("#india");
      if (indiaElement) {
        indiaElement.innerHTML = "";
      }
      const height = "100%";
      const width = "100%";
      const svg = d3
        .select("#india")
        .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("width", width)
        .attr("height", height);

      const container = document.getElementById("india");
      const containerWidth = container?.offsetWidth || 0;
      const containerHeight = container?.offsetHeight || 0;
      console.log(container?.offsetWidth, "kl");

      // Calculate the translate values
      const translateX = containerWidth / 2.2;
      const translateY = containerHeight / 2.8;

      const projection = d3
        .geoMercator()
        .center([80.9629, 23.5937])
        .translate([translateX, translateY])
        .scale(900);

      const path = geoPath().projection(projection);
      // const paths = svg
      //   .selectAll("path")
      //   .data(indiaGeojson.features)
      //   .enter()
      //   .append("path")
      //   .attr("d", (d: any) => path(d) as string)
      //   .attr("fill", "white")
      //   .attr("stroke", "rgba(0, 123, 255, 0.44)")
      //   .attr("stroke-width", 1);

      // // Attach click event listener to each path element
      // paths.on("click", (event, d: any) => {
      //   console.log("Clicked on state:", d.properties.name);
      // });
      // Draw map features
      svg
        .selectAll("path")
        .data(indiaGeojson.features)
        .enter()
        .append("path")
        .attr("d", (d: any) => path(d) as string)
        .attr("fill", "white")
        .attr("stroke", "rgba(0, 123, 255, 0.44)")
        .attr("stroke-width", 1);

      // Bubble data

      // Draw bubbles
      svg
        .selectAll("circle")
        .data(uniqueCities)
        .enter()
        .append("circle")
        .attr("cx", (d) => {
          const coordinates = projection([d.longitude, d.latitude]);
          return coordinates ? coordinates[0] : 0; // Provide a default value if null
        })
        .attr("cy", (d) => {
          const coordinates = projection([d.longitude, d.latitude]);
          return coordinates ? coordinates[1] : 0; // Provide a default value if null
        })
        .attr("r", (d) => (d.radius > 20 ? 20 : d.radius + 5))
        .attr("fill", "rgba(0, 123, 255, 0.44");

      svg
        .selectAll("circle")
        .on("mouseover", (e, d: any) => {
          e.preventDefault();
          console.log(`City: ${d.state}, Radius: ${d.radius}`, d);
          setActiveCircle(d);
        })
        .on("mouseout", () => {
          console.log("Mouseout");
          setActiveCircle(null);
        });
    }
  }, [uniqueCities]); // Empty dependency array to run only once

  return (
    <>
      {" "}
      {activeCircle ? (
        <div className="map-info d-flex flex-column align-center">
          <p>{activeCircle?.city}</p>
          <p>{activeCircle?.radius}</p>
        </div>
      ) : (
        <></>
      )}
      <div id="india" style={{ height: "100%", width: "100%" }}></div>
    </>
  );
};

export default IndiaBubbleMap;
