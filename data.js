const dummydata = [
  {
      "id": 542,
      "store_id": 41,
      "shift": 3,
      "prev_kwh": 193,
      "last_kwh": 198,
      "diff_kwh": 5,
      "type": "pemakaian",
      "created_at": "2023-02-23T03:33:15.000000Z",
      "updated_at": "2023-02-24T01:52:34.000000Z",
      "store": {
          "id": 41,
          "code": 0,
          "district_id": 1,
          "name": "MM RMY",
          "target": 1000000,
          "created_at": null,
          "updated_at": "2023-02-24T01:52:34.000000Z",
          "is_qsr": "n",
          "is_alcohol": "y",
          "is_wine": "y",
          "status_online": "y",
          "no_meter": 0,
          "tipe_bayar": "pasca-bayar",
          "nama_pemilik": "0",
          "last_kwh": 198,
          "min_kwh": 0
      }
  },
  {
      "id": 534,
      "store_id": 41,
      "shift": 2,
      "prev_kwh": 100,
      "last_kwh": 193,
      "diff_kwh": 93,
      "type": "pemakaian",
      "created_at": "2023-02-23T01:36:09.000000Z",
      "updated_at": "2023-02-23T01:38:40.000000Z",
      "store": {
          "id": 41,
          "code": 0,
          "district_id": 1,
          "name": "MM RMY",
          "target": 1000000,
          "created_at": null,
          "updated_at": "2023-02-24T01:52:34.000000Z",
          "is_qsr": "n",
          "is_alcohol": "y",
          "is_wine": "y",
          "status_online": "y",
          "no_meter": 0,
          "tipe_bayar": "pasca-bayar",
          "nama_pemilik": "0",
          "last_kwh": 198,
          "min_kwh": 0
      }
  },
  {
      "id": 533,
      "store_id": 41,
      "shift": 1,
      "prev_kwh": 56,
      "last_kwh": 100,
      "diff_kwh": 44,
      "type": "pemakaian",
      "created_at": "2023-02-23T01:34:52.000000Z",
      "updated_at": "2023-02-23T01:35:13.000000Z",
      "store": {
          "id": 41,
          "code": 0,
          "district_id": 1,
          "name": "MM RMY",
          "target": 1000000,
          "created_at": null,
          "updated_at": "2023-02-24T01:52:34.000000Z",
          "is_qsr": "n",
          "is_alcohol": "y",
          "is_wine": "y",
          "status_online": "y",
          "no_meter": 0,
          "tipe_bayar": "pasca-bayar",
          "nama_pemilik": "0",
          "last_kwh": 198,
          "min_kwh": 0
      }
  },
  {
      "id": 521,
      "store_id": 41,
      "shift": 1,
      "prev_kwh": 0,
      "last_kwh": 56,
      "diff_kwh": 56,
      "type": "pemakaian",
      "created_at": "2023-02-21T23:31:36.000000Z",
      "updated_at": "2023-02-23T01:30:29.000000Z",
      "store": {
          "id": 41,
          "code": 0,
          "district_id": 1,
          "name": "MM RMY",
          "target": 1000000,
          "created_at": null,
          "updated_at": "2023-02-24T01:52:34.000000Z",
          "is_qsr": "n",
          "is_alcohol": "y",
          "is_wine": "y",
          "status_online": "y",
          "no_meter": 0,
          "tipe_bayar": "pasca-bayar",
          "nama_pemilik": "0",
          "last_kwh": 198,
          "min_kwh": 0
      }
  }
];

// const dummydata = [];

class Data{
    constructor(data) {
      this.data = data;
      this.getter = this.getter.bind(this);
      this.setter = this.setter.bind(this);
      this.generate = this.generate.bind(this);
    }

    getter() {
      return this.data;
    }

    setter(newData) {
      this.data = newData;
    }

    generate() {
      return [this.getter, this.setter];
    }
}