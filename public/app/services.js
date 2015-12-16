angular.module('CourseServices', ['firebase', 'ui.bootstrap'])
.factory('Auth', ['$firebaseAuth', function($firebaseAuth) {
  return {
    authObj: $firebaseAuth(new Firebase("https://coursetracker.firebaseio.com")),
    getCurrentUser: function() {
      var authData = this.authObj.$getAuth();
      return (authData && authData.github) ? authData.github : false;
    },
    getCurrentUserUid: function() {
      var authData = this.authObj.$getAuth();
      return (this.getCurrentUser()) ? authData.uid : false;
    },
    isLoggedIn: function() {
      return this.getCurrentUser() ? true : false;
    },
    login: function(callback) {
      this.authObj.$authWithOAuthPopup('github').then(function(authData) {
        console.log('Logged in as:', authData.uid);
        console.log(authData);
        callback(null, authData);
      }).catch(function(error) {
        console.log('Authentication failed');
        callback({message: 'Authentication failed', error: error}, null);
      });
    },
    logout: function() {
      this.authObj.$unauth();
    }
  }
}])
.factory('Cohorts', [function() {
  return new Firebase("https://coursetracker.firebaseio.com/cohorts");
}])
.factory('Students', ['$timeout', function($timeout) {
  return {
    ref: new Firebase("https://coursetracker.firebaseio.com/students"),
    getCohort: function(cohortName, callback) {
      this.ref.orderByChild('cohort').startAt(cohortName).endAt(cohortName).on("value", function(snapshot) {
        $timeout(function() {
          var students = [];
          snapshot.forEach(function(data) {
            students.push(data.val());
          });
          callback(null, students);
        });
      });
    }
  }
}])
.factory('Users', [function() {
  return new Firebase("https://coursetracker.firebaseio.com/users");
}])
.factory('Attendance', [function() {
  return {
    ref: new Firebase("https://coursetracker.firebaseio.com/attendance"),
    getAttendanceByDate: function(date, callback) {
      this.ref.orderByChild('date').startAt(date).endAt(date).on("value", function(snapshot) {
        $timeout(function() {
          var attendance = [];
          snapshot.forEach(function(student) {
            attendance.push(student.val());
          });
          callback(null, attendance);
        });
      });
    }
  }
}])
.factory('Alerts', [function() {
  var alerts = [];

  return {
    clear: function() {
      alerts = [];
    },
    add: function(type, msg) {
      alerts.push({type: type, msg: msg});
    },
    get: function() {
      return alerts;
    },
    remove: function(idx) {
      alerts.splice(idx, 1);
    }
  }
}])
