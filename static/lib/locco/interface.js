// Generated by CoffeeScript 1.9.2
(function() {
  var Chocokup, Interface, _, _module,
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('../../general/chocodash');

  Chocokup = require('../../general/chocokup');

  Interface = _.prototype({
    constructor: function(defaults, service) {
      var item, name;
      if (service == null) {
        service = defaults;
        defaults = void 0;
      }
      if (typeof service === 'function') {
        service = {
          render: service
        };
      }
      if ((service != null) && (defaults != null)) {
        service.defaults = defaults;
      }
      if (service != null) {
        if (service.defaults != null) {
          if (typeof service.defaults === 'function') {
            this.defaults = service.defaults;
          } else {
            this.defaults = _.defaults(this.defaults, service.defaults);
          }
        }
        if (service.locks != null) {
          if (typeof service.locks === 'function') {
            this.locks = service.locks;
          } else {
            this.locks = _.defaults(this.locks, service.locks);
          }
        }
        if (service.check != null) {
          this.check = service.check;
        }
        if (service.steps != null) {
          this.steps = service.steps;
        }
        if (service.action != null) {
          this.render = service.action;
        }
        for (name in service) {
          item = service[name];
          if (name !== 'defaults' && name !== 'locks' && name !== 'check' && name !== 'steps') {
            this[name] = item;
          }
        }
      }
    },
    bind: function(actor, document, name1) {
      this.name = name1;
      if (!((this.actor != null) && (this.document != null))) {
        this.actor = actor;
        this.document = document;
        switch (_.type(this.update)) {
          case _.Type.Function:
            return this.observe(this.update);
          case _.Type.String:
            return this.observe((function(_this) {
              return function(html) {
                $(_this.update).html(html);
              };
            })(this));
        }
      }
    },
    review: function(bin, reaction, end) {
      var check, ref, ref1, self;
      self = {
        bin: bin,
        document: this.document,
        'interface': this
      };
      check = {
        defaults: (function(_this) {
          return function(object, defaults) {
            var set;
            if (typeof defaults === 'function') {
              defaults = defaults.call(_this);
            }
            set = function(o, d) {
              var dk, dv;
              for (dk in d) {
                if (!hasProp.call(d, dk)) continue;
                dv = d[dk];
                if (_.isBasicObject(o[dk]) && _.isBasicObject(dv)) {
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
          };
        })(this),
        locks: (function(_this) {
          return function(keys, locks) {
            var i, len, lock;
            if (locks == null) {
              return true;
            }
            if (typeof locks === 'function') {
              locks = locks.call(self);
            }
            for (i = 0, len = locks.length; i < len; i++) {
              lock = locks[i];
              if (indexOf.call(keys, lock) < 0) {
                return false;
              }
            }
            return true;
          };
        })(this),
        values: (function(_this) {
          return function(bin, controller) {
            return controller.call(self, bin);
          };
        })(this)
      };
      if (reaction.certified == null) {
        reaction.certified = true;
      }
      if (this.defaults != null) {
        check.defaults(bin, this.defaults);
      }
      if (this.locks != null) {
        reaction.certified = check.locks((ref = bin.__) != null ? (ref1 = ref.session) != null ? ref1.keys : void 0 : void 0, this.locks);
      }
      if (this.check != null) {
        reaction.certified = check.values(bin, this.check);
      }
      return end();
    },
    submit: function(bin) {
      var publisher, reaction;
      if (bin == null) {
        bin = {};
      }
      publisher = new _.Publisher;
      reaction = new Interface.Reaction;
      _.flow({
        self: this
      }, function(run) {
        run(function(end) {
          return end["with"](this.review(bin, reaction, end));
        });
        run(function(end) {
          var respond, result, self;
          if (reaction.certified && (this.steps != null)) {
            respond = function(o) {
              this.reaction.bin = o;
              return end();
            };
            respond.later = end;
            self = {
              bin: bin,
              document: this.document,
              'interface': this,
              actor: this.actor,
              reaction: reaction,
              respond: respond,
              transmit: (function(actor, service) {
                actor[service].submit(this.bin).subscribe((function(_this) {
                  return function(reaction) {
                    return _this.respond(reaction.bin);
                  };
                })(this));
                return respond.later;
              })
            };
            result = this.steps.call(self, bin);
          }
          return end["with"](result);
        });
        run(function(end) {
          var respond, result, self;
          if (reaction.certified && (this.render != null)) {
            respond = function(o) {
              this.reaction.bin = o;
              return end();
            };
            respond.later = end;
            self = {
              bin: bin,
              document: this.document,
              'interface': this,
              actor: this.actor,
              reaction: reaction,
              respond: respond,
              transmit: (function(actor, service) {
                actor[service].submit(this.bin).subscribe((function(_this) {
                  return function(reaction) {
                    return _this.respond(reaction.bin);
                  };
                })(this));
                return respond.later;
              })
            };
            result = this.render.call(self, bin);
            if (!((reaction.bin != null) || result === end.later)) {
              reaction.bin = result;
            }
          }
          return end["with"](result);
        });
        return run(function() {
          return publisher.notify(reaction);
        });
      });
      return publisher;
    },
    observe: function(render) {
      return new _.Observer((function(_this) {
        return function() {
          var ref;
          if ((ref = _this.document.signal) != null) {
            ref.value();
          }
          return _this.submit().subscribe(function(arg) {
            var bin;
            bin = arg.bin;
            return render(typeof bin.render === 'function' ? bin.render() : bin);
          });
        };
      })(this));
    }
  });

  Interface.Reaction = _.prototype({
    constructor: function(bin1, certified) {
      this.bin = bin1;
      this.certified = certified;
    }
  });

  Interface.Remote = _.prototype({
    inherit: Interface,
    use: function() {
      return this.submit = function(bin) {
        if (bin == null) {
          bin = {};
        }
        if ('__' in bin) {
          return _["super"](this, bin);
        } else {
          return this.actor.submit(this.name, bin);
        }
      };
    }
  });

  Interface.Web = _.prototype({
    inherit: Interface,
    use: function() {
      var get_declare_kups;
      get_declare_kups = function(kups) {
        var declare_kups, declare_path, i, j, kup, len, len1, path, ref, step;
        declare_kups = [];
        declare_path = {};
        for (i = 0, len = kups.length; i < len; i++) {
          kup = kups[i];
          path = "this.locals";
          ref = kup.scope;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            step = ref[j];
            path += "." + step;
            if (declare_path[path] == null) {
              declare_path[path] = path + " = " + path + " ? " + path + " : {}";
              declare_kups.push(declare_path[path]);
            }
          }
          declare_kups.push("this.locals" + (kup.scope.length > 0 ? '.' + kup.scope.join('.') : '') + "." + kup.name + " = _kup_" + kup.id);
        }
        return declare_kups;
      };
      this.type = 'App';
      this.review = function(bin, reaction, end) {
        _.flow({
          self: this
        }, function(run) {
          run(function(end) {
            return end["with"](_["super"](Interface.Web.prototype.review, this, bin, reaction, end));
          });
          return run(function() {
            var check_interfaces, scope;
            reaction.bin = '';
            if (reaction.kups === false) {
              return end();
            }
            scope = [];
            check_interfaces = function(bin) {
              var base, declare_kups, defaults, kups, local_kups, name, name1, ref, ref1, scope_, service, service_id, service_kup;
              local_kups = [];
              for (name in bin) {
                service = bin[name];
                if (service instanceof Interface.Web) {
                  if (!((service != null ? service.defaults : void 0) == null)) {
                    defaults = service.defaults;
                    if (typeof defaults === 'function') {
                      defaults = defaults();
                    }
                    scope_ = scope;
                    scope = [];
                    kups = check_interfaces(defaults);
                    scope = scope_;
                  } else {
                    kups = [];
                  }
                  declare_kups = get_declare_kups(kups);
                  service_id = _.Uuid().replace(/\-/g, '_');
                  service_kup = new Function('args', "var interface = this.interface, bin = this.bin, actor = this.actor, __hasProp = {}.hasOwnProperty;\ntry {this.interface = bin" + (scope.length > 0 ? '.' + scope.join('.') : '') + "." + name + ";} \ncatch (error) { try {this.interface = bin." + name + ";} catch (error) {}; };\nthis.actor = this.interface != null ? this.interface.actor : null;\nthis.bin = {};\nthis.keys = [];\nif (this.bin.__ == null) this.bin.__ = bin.__\nif (bin != null) {for (k in bin) {if (__hasProp.call(bin, k)) { this.bin[k] = bin[k]; }}}\nif (args != null) {for (k in args) {if (__hasProp.call(args, k)) { this.bin[k] = args[k]; this.keys.push(k); }}}\nreaction = {kups:false};\nif (this.interface != null)\n    this.interface.review(this.bin, reaction, function(){});\nif (reaction.certified) {\n    " + (declare_kups.join(';\n')) + ";\n    with (this.locals) {(" + (((ref = (ref1 = service.render) != null ? ref1.overriden : void 0) != null ? ref : service.render).toString()) + ").call(this, this.bin);}\n}\nthis.bin = bin; this.interface = interface, this.actor = actor;");
                  if (reaction.kups == null) {
                    reaction.kups = {};
                  }
                  if ((base = reaction.kups)[name1 = "_kup_" + service_id] == null) {
                    base[name1] = service_kup;
                  }
                  local_kups.push({
                    name: name,
                    scope: [].concat(scope),
                    id: service_id
                  });
                } else {
                  if (service !== '__' && _.isBasicObject(service)) {
                    scope.push(name);
                    local_kups = local_kups.concat(check_interfaces(service));
                    scope.pop();
                  }
                }
              }
              return local_kups;
            };
            reaction.local_kups = check_interfaces(bin);
            return end();
          });
        });
        return end;
      };
      return this.submit = function(bin) {
        var callback, chocokup_code, ref, ref1, render_code, result;
        if (!((ref = this.render) != null ? ref.overriden : void 0)) {
          render_code = (ref1 = this.render) != null ? ref1 : function() {};
          chocokup_code = null;
          this.render = function(bin) {
            var declare_kups, kups, local_kups, options;
            if (bin == null) {
              bin = {};
            }
            kups = this.reaction.kups;
            delete this.reaction.kups;
            local_kups = this.reaction.local_kups;
            delete this.reaction.local_kups;
            declare_kups = get_declare_kups(local_kups);
            chocokup_code = declare_kups.length > 0 ? new Function('args', "this.keys = [];\nif (args != null) {for (k in args) {if ({}.hasOwnProperty.call(args, k)) { this.bin[k] = args[k]; this.keys.push(k); }}}\n" + (declare_kups.join(';\n')) + ";\nwith (this.locals) {return (" + (render_code.toString()) + ").apply(this, arguments);}") : render_code;
            options = {
              bin: bin,
              document: this.document,
              'interface': this,
              actor: this.actor,
              kups: kups
            };
            if (bin.theme != null) {
              options.theme = bin.theme;
            }
            if (bin.with_coffee != null) {
              options.with_coffee = bin.with_coffee;
            }
            if (bin.manifest != null) {
              options.manifest = bin.manifest;
            }
            return this.reaction.bin = (function() {
              var ref2;
              switch (this["interface"].type) {
                case 'Panel':
                  return new Chocokup.Panel(options, chocokup_code);
                default:
                  return new Chocokup[this["interface"].type]((ref2 = bin != null ? bin.name : void 0) != null ? ref2 : '', options, chocokup_code);
              }
            }).call(this);
          };
          this.render.overriden = chocokup_code != null ? chocokup_code : render_code;
        }
        if (typeof bin === 'function') {
          callback = bin;
          bin = {};
        }
        result = _["super"](this, bin);
        if (callback != null) {
          result.subscribe(function(reaction) {
            return callback(reaction.bin.render());
          });
        }
        return result;
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

  Interface.Web.Panel = Interface.Web.Html = _.prototype({
    inherit: Interface.Web,
    use: function() {
      return this.type = 'Panel';
    }
  });

  _module = typeof window !== "undefined" && window !== null ? window : module;

  if (_module.exports != null) {
    _module.exports = Interface;
  } else {
    if (window.Locco == null) {
      window.Locco = {};
    }
    window.Locco.Interface = Interface;
  }

}).call(this);
