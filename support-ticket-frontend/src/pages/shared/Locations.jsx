import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import {
  fetchProvinces,
  fetchDistrictsByProvince,
  fetchSectorsByDistrict,
  fetchCellsBySector,
  fetchVillagesByCell,
} from "../../services/locationService";

export default function Locations() {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [cells, setCells] = useState([]);
  const [villages, setVillages] = useState([]);

  const [sel, setSel] = useState({
    province: "",
    district: "",
    sector: "",
    cell: "",
  });

  useEffect(() => {
    fetchProvinces().then(setProvinces);
  }, []);

  const loadDistricts = async (id) => {
    setSel({ province: id, district: "", sector: "", cell: "" });
    setSectors([]);
    setCells([]);
    setVillages([]);
    const res = await fetchDistrictsByProvince(id);
    setDistricts(res);
  };

  const loadSectors = async (id) => {
    setSel({ ...sel, district: id, sector: "", cell: "" });
    setCells([]);
    setVillages([]);
    const res = await fetchSectorsByDistrict(id);
    setSectors(res);
  };

  const loadCells = async (id) => {
    setSel({ ...sel, sector: id, cell: "" });
    setVillages([]);
    const res = await fetchCellsBySector(id);
    setCells(res);
  };

  const loadVillages = async (id) => {
    setSel({ ...sel, cell: id });
    const res = await fetchVillagesByCell(id);
    setVillages(res);
  };

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Locations</h1>

      <div className="grid md:grid-cols-5 gap-4">
        {/* Province */}
        <div>
          <h3 className="font-semibold mb-2">Provinces</h3>
          <ul className="space-y-1">
            {provinces.map((p) => (
              <li
                key={p.id}
                className="cursor-pointer hover:underline"
                onClick={() => loadDistricts(p.id)}
              >
                {p.name}
              </li>
            ))}
          </ul>
        </div>

        {/* District */}
        <div>
          <h3 className="font-semibold mb-2">Districts</h3>
          <ul className="space-y-1">
            {districts.map((d) => (
              <li
                key={d.id}
                className="cursor-pointer hover:underline"
                onClick={() => loadSectors(d.id)}
              >
                {d.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Sector */}
        <div>
          <h3 className="font-semibold mb-2">Sectors</h3>
          <ul className="space-y-1">
            {sectors.map((s) => (
              <li
                key={s.id}
                className="cursor-pointer hover:underline"
                onClick={() => loadCells(s.id)}
              >
                {s.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Cell */}
        <div>
          <h3 className="font-semibold mb-2">Cells</h3>
          <ul className="space-y-1">
            {cells.map((c) => (
              <li
                key={c.id}
                className="cursor-pointer hover:underline"
                onClick={() => loadVillages(c.id)}
              >
                {c.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Village */}
        <div>
          <h3 className="font-semibold mb-2">Villages</h3>
          <ul className="space-y-1">
            {villages.map((v) => (
              <li key={v.id}>{v.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
