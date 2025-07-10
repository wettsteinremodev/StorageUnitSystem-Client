import http from "../http-common";

class StorageUnitDataService {
  getAll(sortedBy) {
    if(sortedBy){
        return http.get(`/storageunits?sortedBy=${sortedBy}`)
    }
    return http.get("/storageunits");
  }

  get(id) {
    return http.get(`/storageunits/${id}`);
  }

  create(data) {
    return http.post("/storageunits", data);
  }

  update(id, data) {
    return http.put(`/storageunits/${id}`, data);
  }

  delete(id) {
    return http.delete(`/storageunits/${id}`);
  }

  deleteAll() {
    return http.delete(`/storageunits`);
  }

//   findByTitle(title) {
//     return http.get(`/tutorials?title=${title}`);
//   }
}

export default new StorageUnitDataService();