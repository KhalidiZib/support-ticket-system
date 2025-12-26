import api from './api';

export async function fetchLocations(params = {}) {
  const { type, parentId } = params;
  const { data } = await api.get('/locations', { params: { type, parentId } });
  return data;
}

export async function fetchLocationsPaginated(page = 0, size = 10) {
  const { data } = await api.get('/locations/paginated', { params: { page, size } });
  return data;
}

export async function fetchTopLevelLocations() {
  const { data } = await api.get('/locations/top-level');
  return data;
}

export async function fetchLocationsByParent(parentId) {
  const { data } = await api.get(`/locations/parent/${parentId}`);
  return data;
}

export async function fetchLocationsByType(type) {
  const { data } = await api.get(`/locations/type/${type}`);
  return data;
}

export async function createLocation(locationData) {
  const { data } = await api.post('/locations', locationData);
  return data;
}

export async function deleteLocation(id) {
  await api.delete(`/locations/${id}`);
}
