'use strict'

class Querify {
  register (Model) {
    Model.getFromQuery = (query) => {
      this.model = Model;
      return this.getModelQuery(query)
    }
  }

  getModelQuery(query) {
    let modelQuery = this.model.query();
    modelQuery = this.getRelationships(query.relationships, modelQuery);
    modelQuery = this.getFilters(query.filter, modelQuery);
    modelQuery = this.getSorts(query.sort, modelQuery);
    modelQuery = this.getPaginate(query.limit, query.page, modelQuery);

    return modelQuery;
}

/**
 * get all the ralationships in the query
 * @param {String} relationships 
 * @return Array
 */
getRelationships(relationships, modelQuery) {
  if (relationships) {
    relationships = relationships.split(',').map(relation => relation.trim());

    relationships.forEach((relation) => {
      modelQuery.with(relation);
    })
  }

  return modelQuery
}

getFilters(filters, modelQuery) {
  if (filters) {
    filters = Object.entries(filters);
    filters.forEach( filter => {
      const [field, value] = filter;
      this.addFilter(field, value, modelQuery)
    })
  }

  return modelQuery
}

getSorts(sorts, modelQuery) {
  if (sorts) {
    sorts = this.splitAndTrim(sorts);
    sorts.forEach( sort => {
      const direction = sort.slice(0,1) == "-" ? "DESC" : "ASC";
      sort = direction == "ASC" ? sort : sort.slice(1);
      modelQuery.orderBy(sort, direction);
    })
  }

  return modelQuery
}

getPaginate(limit, page, modelQuery) {
  if (limit && page) {
    return modelQuery.paginate(page, limit);
  } else if (limit) {
    modelQuery.limit(limit);
  }

  return modelQuery.fetch();
}


  addFilter(field, value, modelQuery) {
    let optionalValues, disableSecondWhere;
    switch (typeof value) {
      case 'string':
        optionalValues = this.splitAndTrim(value);
        break;
      case 'object':
          if (Array.isArray(value)) {
            optionalValues = value;
            disableSecondWhere = true 
          }
          break;
          default:
            optionalValues = []
        break;
    }
    
    optionalValues.forEach( (optionalValue, index) => {
      let where = "where"
      if (index && !disableSecondWhere) {
        where = "orWhere"
      }

      const isBetween = optionalValue.includes("~", 1);

      if (isBetween) {
        const betweenArgs = this.splitAndTrim(optionalValue, '~');
        modelQuery[`${where}Between`](field, betweenArgs)
        return
      }

      switch (optionalValue.slice(0,1)) {
        case '>':
          modelQuery[where](field, ">", optionalValue.slice(1))
          break;
        case '<':
          modelQuery[where](field, "<", optionalValue.slice(1))
          break;
        case '%':
          modelQuery[where](field,'LIKE', optionalValue)
          break;
        case '~':
          modelQuery[`${where}Not`](field, optionalValue.slice(1))
          break;
        case '$':
          modelQuery[`${where}Null`](field, optionalValue.slice(1))
          break;
        default:
          modelQuery[where](field, optionalValue)
          break;
      }
    })

  }

  splitAndTrim(text, separator = ',') {
    return text.split(separator).map( optional => optional.trim());
  }
}

module.exports = Querify
