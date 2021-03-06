//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2017 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2017 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
//++

/*jshint expr: true*/

describe('UrlParamsHelper', function() {
  var UrlParamsHelper, PathHelper;

  beforeEach(angular.mock.module('openproject.helpers', 'openproject.models'));
  beforeEach(inject(function(_UrlParamsHelper_, _PathHelper_) {
    UrlParamsHelper = _UrlParamsHelper_;
    PathHelper = _PathHelper_;
  }));

  describe('buildQueryString', function() {
    var params = {
      ids: [1, 2, 3],
      str: '@#$%'
    };
    var queryString;

    beforeEach(function() {
      queryString = UrlParamsHelper.buildQueryString(params);
    });

    it('concatenates propertys with \'&\'', function() {
      expect(queryString.split('&')).to.have.length(4);
    });

    it('escapes special characters', function() {
      expect(queryString).not.to.include('@');
    });
  });

  describe('encodeQueryJsonParams', function(){
    var query;
    var additional;

    beforeEach(function() {
      var filter1 = {
        id: 'soße',
        name: 'soße_id',
        type: 'list_model',
        operator: {
          $href: '/api/operator/='
        },
        filter: {
          $href: '/api/filter/soße'
        },
        values: ['knoblauch']
      };
      var filter2 = {
        id: 'created_at',
        type: 'datetime_past',
        operator: {
          $href: '/api/operator/<t-'
        },
        filter: {
          $href: '/api/filter/created_at'
        },
        values: ['5']
      };
      query = {
        id: 1,
        name: 'knoblauch soße',
        sums: true,
        timelineVisible: true,
        columns: [{ id: 'type' }, { id: 'status' }, { id: 'soße' }],
        groupBy: {
          id: 'status'
        },
        sortBy: [{
          id: 'type-desc'
        }],
        filters: [filter1, filter2]
      };

      additional = {
        page: 10,
        perPage: 100
      }
    });

    it('should encode query to params JSON', function() {
      var encodedJSON = UrlParamsHelper.encodeQueryJsonParams(query, additional);
      var expectedJSON = "{\"c\":[\"type\",\"status\",\"soße\"],\"s\":true,\"tv\":true,\"g\":\"status\",\"t\":\"type:desc\",\"f\":[{\"n\":\"soße\",\"o\":\"%3D\",\"v\":[\"knoblauch\"]},{\"n\":\"created_at\",\"o\":\"%3Ct-\",\"v\":[\"5\"]}],\"pa\":10,\"pp\":100}";
      expect(encodedJSON).to.eq(expectedJSON);
    });
  });

  describe('buildV3GetQueryFromJsonParams', function() {
    var params;

    beforeEach(function() {
      params = "{\"c\":[\"type\",\"status\",\"soße\"],\"s\":true,\"tv\":true,\"g\":\"status\",\"t\":\"type:desc,status:asc\",\"f\":[{\"n\":\"soße\",\"o\":\"%3D\",\"v\":[\"knoblauch\"]},{\"n\":\"created_at\",\"o\":\"%3Ct-\",\"v\":[\"5\"]}],\"pa\":10,\"pp\":100}";
    });

    it('should decode query params to object', function() {
      var decodedQueryParams = UrlParamsHelper.buildV3GetQueryFromJsonParams(params);

      var expected = {
        'columns[]': ['type', 'status', 'soße'],
        showSums: true,
        timelineVisible: true,
        groupBy: 'status',
        filters: JSON.stringify([
          {
            soße: {
              operator: '=',
              values: ['knoblauch']
            }
          },
          {
            created_at: {
              operator: '<t-',
              values: ['5']
            }
          }
        ]),
        sortBy: JSON.stringify([['type', 'desc'], ['status', 'asc']]),
        offset: 10,
        pageSize: 100
      };

      expect(angular.equals(decodedQueryParams, expected)).to.be.true;
    });
  });

  describe('buildV3GetQueryFromQueryResource', function() {
    var query;
    var additional;

    it('decodes query params to object', function() {
      var filter1 = {
        id: 'soße',
        name: 'soße_id',
        type: 'list_model',
        operator: {
          $href: '/api/operator/='
        },
        filter: {
          $href: '/api/filter/soße'
        },
        values: ['knoblauch']
      };
      var filter2 = {
        id: 'created_at',
        type: 'datetime_past',
        operator: {
          $href: '/api/operator/<t-'
        },
        filter: {
          $href: '/api/filter/created_at'
        },
        values: ['5']
      };
      query = {
        id: 1,
        name: 'knoblauch soße',
        sums: true,
        columns: [{ id: 'type' }, { id: 'status' }, { id: 'soße' }],
        groupBy: {
          id: 'status'
        },
        sortBy: [
          {
            id: 'type-desc'
          },
          {
            id: 'status-asc'
          }
        ],
        filters: [filter1, filter2]
      };

      additional = {
        offset: 10,
        pageSize: 100
      }

      var v3Params = UrlParamsHelper.buildV3GetQueryFromQueryResource(query, additional);

      var expected = {
        'columns[]': ['type', 'status', 'soße'],
        showSums: true,
        groupBy: 'status',
        filters: JSON.stringify([
          {
            soße: {
              operator: '=',
              values: ['knoblauch']
            }
          },
          {
            created_at: {
              operator: '<t-',
              values: ['5']
            }
          }
        ]),
        sortBy: JSON.stringify([['type', 'desc'], ['status', 'asc']]),
        offset: 10,
        pageSize: 100
      };

      expect(angular.equals(v3Params, expected)).to.be.true;
    });

    it('decodes string object filters', function() {
      var filter1 = {
        id: 'customField1',
        operator: {
          $href: '/api/operator/='
        },
        filter: {
          $href: '/api/filter/customField1'
        },
        values: [
          {
            _type: "StringObject",
            value: "val2val",
            $href: "/api/v3/string_objects/?value=val2val"
          },
          {
            _type: "StringObject",
            value: "7val7",
            $href: "/api/v3/string_objects/?value=7val7"
          }
        ]
      };
      query = {
        filters: [filter1],
        sortBy: [],
        columns: [],
        sums: false
      };

      additional = {}

      var v3Params = UrlParamsHelper.buildV3GetQueryFromQueryResource(query, additional);

      var expected = {
        'columns[]': [],
        filters: JSON.stringify([
          {
            customField1: {
              operator: '=',
              values: ['val2val', '7val7']
            }
          }
        ]),
        showSums: false,
        sortBy: '[]'
      };

      expect(angular.equals(v3Params, expected)).to.be.true;
    });
  });
});
