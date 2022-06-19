'use strict';

// THIS IS THE STRETCH GOAL ...
// It takes in a schema in the constructor and uses that instead of every collection
// being the same and requiring their own schema. That's not very DRY!

class DataCollection {

  constructor(model) {
    this.model = model;
  }

  get(id) {
    if (id) {
      return this.model.findOne({where:{id:id} });
    }
    else {
      return this.model.findAll({});
    }
  }

  create(record) {
    return this.model.create(record);
  }

  async update(obj) {
    try {
        let record = await this.model.findOne({ where: { id: data_id } });
        let updated = await record.update(obj);
        return updated;
    }
    catch (e) {
        console.log("this error happen when updated this model", this.model);
    }
}

  delete(id) {
    return this.model.destroy({ where: { id }});
  }

}

module.exports = DataCollection;
