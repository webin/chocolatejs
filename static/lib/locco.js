if (typeof window !== "undefined" && window !== null) { window.previousExports = window.exports; window.exports = {} };
// Generated by CoffeeScript 1.6.3
/*
    Intention
    Data
    Action
    Document
    Workflow
    Interface
    Actor
    Reserve
    Prototype
*/


(function() {
  var previousRequire, require, resolve, use_cache;

  if ((typeof window !== "undefined" && window !== null) && (window.Locco == null)) {
    window.modules = {
      locco: window[window.exports != null ? "exports" : "Locco"] = {}
    };
    if (!($ && $.ajax)) {
      if (window.require == null) {
        window.require = function() {
          return window.exports;
        };
      }
      return;
    }
    previousRequire = window.require;
    use_cache = true;
    window.require = require = function(modulename, filename, options) {
      var cachedModule, result, _previousExports, _previous_use_cache;
      if (arguments.length === 2 && Object.prototype.toString.apply(filename !== '[object String]')) {
        options = filename;
        filename = null;
      }
      if (filename == null) {
        filename = modulename;
      }
      filename = resolve(filename);
      if ((options != null ? options.use_cache : void 0) != null) {
        _previous_use_cache = use_cache;
        use_cache = options.use_cache;
      }
      result = typeof previousRequire === "function" ? previousRequire(filename) : void 0;
      if (result != null) {
        return result;
      }
      if (use_cache) {
        cachedModule = window.modules[filename];
        if (cachedModule != null) {
          return cachedModule;
        }
      }
      _previousExports = window.exports;
      window.exports = {};
      $.ajax({
        url: '/static/lib/' + filename + '.js',
        async: false,
        cache: true,
        error: function(type, xhr, settings) {
          return alert('Error: ' + xhr.status);
        },
        dataType: 'script'
      });
      result = window.modules[filename] = window.exports;
      window.exports = _previousExports;
      if ((options != null ? options.use_cache : void 0) != null) {
        use_cache = _previous_use_cache;
      }
      return result;
    };
    window.require.resolve = resolve = function(filename) {
      var i;
      filename = filename.toLowerCase().replace(/^\.\//, '').replace(/\.\.\//g, '').replace(/^general\//, '').replace(/^client\//, '');
      return filename = (i = filename.lastIndexOf('.')) >= 0 ? filename.slice(0, i) : filename;
    };
    window.require.cache = function(used) {
      return use_cache = used;
    };
  }

}).call(this);

if (typeof window !== "undefined" && window !== null) { window.modules['locco/intention'] = window.exports; window.exports = window.previousExports };

if (typeof window !== "undefined" && window !== null) { window.previousExports = window.exports; window.exports = {} };
// Generated by CoffeeScript 1.6.3
(function() {
  var Data, all, _, _module, _ref;

  _ = require('../../general/chocodash');

  Data = _.prototype({
    constructor: function(uuid, name, data) {
      this.uuid = uuid != null ? uuid : _.Uuid();
      this.name = name;
      this.data = data;
    }
  });

  all = {};

  Data.get = function(uuid) {
    return all[uuid];
  };

  Data.register = function(io) {
    return all[io.uuid] = io;
  };

  Data.forget = function(io) {
    return delete all[io.uuid];
  };

  _module = typeof window !== "undefined" && window !== null ? window : module;

  if (_module.exports != null) {
    _module.exports = Data;
  } else {
    if ((_ref = window.Locco) != null) {
      _ref.Data = Data;
    }
  }

}).call(this);

if (typeof window !== "undefined" && window !== null) { window.modules['locco/data'] = window.exports; window.exports = window.previousExports };

if (typeof window !== "undefined" && window !== null) { window.previousExports = window.exports; window.exports = {} };
// Generated by CoffeeScript 1.6.3
(function() {
  var Data, Document, _, _module, _ref,
    __hasProp = {}.hasOwnProperty;

  _ = require('../../general/chocodash');

  Data = require('../../general/locco/data');

  Document = _.prototype({
    constructor: function(o) {
      var materialize;
      if ((o != null ? o.uuid : void 0) == null) {
        o = new Data;
      }
      materialize = function(o, root, parent) {
        var idoc, key, member;
        if ((o == null) || typeof o !== 'object') {
          return o;
        }
        idoc = parent == null ? root : new o.constructor();
        for (key in o) {
          if (!__hasProp.call(o, key)) continue;
          idoc[key] = materialize(o[key], root, o.matter ? idoc : parent);
        }
        if ((idoc.uuid != null) && (parent != null)) {
          idoc.parent = parent;
        }
        Data.register(idoc);
        if (parent != null) {
          if (idoc.name != null) {
            if (parent.members == null) {
              parent.members = {};
            }
            member = parent.members[idoc.name];
            if (member != null) {
              if (_.type(member) === _.Type.Array) {
                member.push(idoc);
              } else {
                parent.members[idoc.name] = [member, idoc];
              }
            } else {
              parent.members[idoc.name] = idoc;
            }
          } else if (idoc.uuid != null) {
            (parent.items != null ? parent.items : parent.items = []).push(idoc);
          }
        }
        return idoc;
      };
      return materialize(o, this);
    }
  });

  _module = typeof window !== "undefined" && window !== null ? window : module;

  if (_module.exports != null) {
    _module.exports = Document;
  } else {
    if ((_ref = window.Locco) != null) {
      _ref.Document = Document;
    }
  }

}).call(this);

if (typeof window !== "undefined" && window !== null) { window.modules['locco/document'] = window.exports; window.exports = window.previousExports };

if (typeof window !== "undefined" && window !== null) { window.previousExports = window.exports; window.exports = {} };
// Generated by CoffeeScript 1.7.1
(function() {
  var Chocokup, Interface, _, _module, _ref,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('../../general/chocodash');

  Chocokup = require('../../general/chocokup');

  Interface = _.prototype({
    constructor: function(service) {
      if (typeof service === 'function') {
        service = {
          action: service
        };
      }
      if ((service != null ? service.rules : void 0) != null) {
        this.rules = _.defaults(this.rules, service.rules);
      }
      if ((service != null ? service.action : void 0) != null) {
        this.action = service.action;
      }
    },
    review: function(bin, reaction, next) {
      var check, check_services, review_result, _ref, _ref1, _ref2;
      check = {
        defaults: function(object, defaults) {
          var set;
          set = function(o, d) {
            var dk, dv;
            for (dk in d) {
              if (!__hasProp.call(d, dk)) continue;
              dv = d[dk];
              if (_.type(o[dk]) === _.Type.Object && _.type(dv) === _.Type.Object && !dv instanceof Interface) {
                set(o[dk], dv);
              } else {
                if (o[dk] == null) {
                  o[dk] = dv;
                }
              }
            }
            return o;
          };
          return set(object, defaults);
        },
        locks: function(keys, locks) {
          var lock, _i, _len;
          if (locks == null) {
            return true;
          }
          for (_i = 0, _len = locks.length; _i < _len; _i++) {
            lock = locks[_i];
            if (__indexOf.call(keys, lock) < 0) {
              return false;
            }
          }
          return true;
        },
        values: function(bin, controller) {
          return controller.call(bin);
        }
      };
      check_services = function() {
        var check_services_result;
        check_services_result = null;
        _.serialize(function(defer) {
          var check_service;
          check_service = function(service_bin) {
            var name, service, _fn, _results;
            _fn = function(_bin, _name, _service) {
              return defer(function(next_service) {
                var service_result, _base;
                if ((_base = _bin[_name]).bin == null) {
                  _base.bin = {
                    __: _bin.__
                  };
                }
                service_result = _service.review(_bin[_name].bin, reaction, next_service);
                if (service_result === next_service) {
                  check_services_result = next;
                } else {
                  next_service();
                }
                return service_result;
              });
            };
            _results = [];
            for (name in service_bin) {
              service = service_bin[name];
              if (!(service instanceof Interface)) {
                continue;
              }
              _fn(service_bin, name, service);
              _results.push(check_service(service_bin[name]));
            }
            return _results;
          };
          check_service(bin);
          return defer(false, function() {
            return next();
          });
        });
        return check_services_result;
      };
      if (reaction.certified == null) {
        reaction.certified = true;
      }
      if (this.rules != null) {
        if (this.rules.defaults != null) {
          check.defaults(bin, this.rules.defaults);
        }
        if (this.rules.locks != null) {
          reaction.certified = check.locks((_ref = bin.__) != null ? (_ref1 = _ref.session) != null ? _ref1.keys : void 0 : void 0, this.rules.locks);
        }
        if (this.rules.values != null) {
          reaction.certified = check.values(bin, this.rules.values);
        }
        if (reaction.certified && (((_ref2 = this.rules) != null ? _ref2.steps : void 0) != null)) {
          review_result = this.rules.steps.call({
            bin: bin,
            reaction: reaction
          }, {
            bin: bin,
            reaction: reaction,
            next: check_services
          });
        }
        switch (review_result) {
          case check_services:
            return next;
          case void 0:
            return check_services();
          default:
            return null;
        }
      }
      return check_services();
    },
    submit: function(bin) {
      var publisher, reaction;
      publisher = new _.Publisher;
      reaction = new Interface.Reaction;
      _.serialize(this, function(step) {
        step(function(next) {
          var result;
          result = this.review(bin, reaction, next);
          if (result !== next) {
            return next();
          }
        });
        step(function(next) {
          var result;
          if (reaction.certified && (this.action != null)) {
            result = this.action.call({
              bin: bin,
              reaction: reaction
            }, {
              bin: bin,
              reaction: reaction,
              next: next
            });
          }
          if (!((reaction.bin != null) || result === next)) {
            reaction.bin = result;
          }
          if (result !== next) {
            return next();
          }
        });
        return step(false, function() {
          return publisher.notify(reaction);
        });
      });
      return publisher;
    }
  });

  Interface.Reaction = _.prototype({
    constructor: function(bin, certified) {
      this.bin = bin;
      this.certified = certified;
    }
  });

  Interface.Web = _.prototype({
    inherit: Interface,
    use: function() {
      this.type = 'App';
      this.review = function(bin, reaction, next) {
        _.serialize(this, function(step) {
          step(function(next) {
            var result;
            result = _["super"](Interface.Web.prototype.review, this, bin, reaction, next);
            if (result !== next) {
              return next();
            }
          });
          return step(false, function() {
            var name, service, _base, _ref, _ref1;
            reaction.bin = '';
            for (name in bin) {
              service = bin[name];
              if (!(service instanceof Interface.Web)) {
                continue;
              }
              if (reaction.kups == null) {
                reaction.kups = {};
              }
              if ((_base = reaction.kups)[name] == null) {
                _base[name] = (_ref = (_ref1 = service.action) != null ? _ref1.overriden : void 0) != null ? _ref : service.action;
              }
            }
            return next();
          });
        });
        return next;
      };
      return this.submit = function(bin) {
        var chocokup_code, _ref, _ref1;
        if (!((_ref = this.action) != null ? _ref.overriden : void 0)) {
          chocokup_code = (_ref1 = this.action) != null ? _ref1 : function() {};
          this.action = (function(_this) {
            return function(params) {
              var kups, reaction;
              bin = params.bin, reaction = params.reaction;
              kups = reaction.kups;
              delete reaction.kups;
              return reaction.bin = (function() {
                var _ref2;
                switch (this.type) {
                  case 'Panel':
                    return new Chocokup.Panel({
                      bin: bin,
                      kups: kups
                    }, chocokup_code);
                  default:
                    return new Chocokup[this.type]((_ref2 = bin != null ? bin.name : void 0) != null ? _ref2 : '', {
                      bin: bin,
                      kups: kups
                    }, chocokup_code);
                }
              }).call(_this);
            };
          })(this);
          this.action.overriden = chocokup_code;
        }
        return _["super"](this, bin);
      };
    }
  });

  Interface.Web.App = Interface.Web;

  Interface.Web.Document = _.prototype({
    inherit: Interface.Web,
    use: function() {
      return this.type = 'Document';
    }
  });

  Interface.Web.Panel = _.prototype({
    inherit: Interface.Web,
    use: function() {
      return this.type = 'Panel';
    }
  });

  _module = typeof window !== "undefined" && window !== null ? window : module;

  if (_module.exports != null) {
    _module.exports = Interface;
  } else {
    if ((_ref = window.Locco) != null) {
      _ref.Interface = Interface;
    }
  }

}).call(this);

if (typeof window !== "undefined" && window !== null) { window.modules['locco/interface'] = window.exports; window.exports = window.previousExports };

if (typeof window !== "undefined" && window !== null) { window.previousExports = window.exports; window.exports = {} };
// Generated by CoffeeScript 1.6.3
(function() {
  var Prototype, _, _module, _ref;

  _ = require('../../general/chocodash');

  Prototype = _.prototype({
    constructor: function() {}
  });

  _module = typeof window !== "undefined" && window !== null ? window : module;

  if (_module.exports != null) {
    _module.exports = Prototype;
  } else {
    if ((_ref = window.Locco) != null) {
      _ref.Prototype = Prototype;
    }
  }

}).call(this);

if (typeof window !== "undefined" && window !== null) { window.modules['locco/prototype'] = window.exports; window.exports = window.previousExports };

if (typeof window !== "undefined" && window !== null) { window.previousExports = window.exports; window.exports = {} };
// Generated by CoffeeScript 1.6.3
(function() {
  var Action, Workflow, _module, _ref;

  Workflow = (function() {
    function _Class() {
      ({
        bin: {}
      });
    }

    _Class.prototype.execute = function(action) {
      var _i, _len, _ref, _results;
      _ref = action.actions;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        action = _ref[_i];
        switch (so) {
          case 'go':
            _results.push(this.bin = {});
            break;
          default:
            _results.push(void 0);
        }
      }
      return _results;
    };

    return _Class;

  })();

  Workflow.Action = Action = (function() {
    function _Class() {
      this.actions = [];
    }

    _Class.prototype["do"] = function(what, value, type) {
      this.actions.push({
        so: 'do',
        what: what,
        value: value,
        type: type
      });
      return this;
    };

    _Class.prototype.move = function(what, way) {
      if (way == null) {
        way = Action.go.Way.Export;
      }
      this.actions.push({
        so: 'move',
        what: what,
        way: way
      });
      return this;
    };

    _Class.prototype["eval"] = function(what, value) {
      this.actions.push({
        so: 'eval',
        what: what,
        value: value
      });
      return this;
    };

    _Class.prototype.go = function(what, where) {
      if (where == null) {
        where = Action.go.Where.Inside;
      }
      this.actions.push({
        so: 'go',
        what: what,
        where: where
      });
      return this;
    };

    return _Class;

  })();

  Action.prototype.move.Way = {
    Export: 0,
    Import: 1
  };

  Action.prototype.go.Where = {
    Discover: 0,
    Inside: 1,
    Through: 2
  };

  _module = typeof window !== "undefined" && window !== null ? window : module;

  if (_module.exports != null) {
    _module.exports = Workflow;
  } else {
    if ((_ref = window.Locco) != null) {
      _ref.Workflow = Workflow;
    }
  }

}).call(this);

if (typeof window !== "undefined" && window !== null) { window.modules['locco/workflow'] = window.exports; window.exports = window.previousExports };

