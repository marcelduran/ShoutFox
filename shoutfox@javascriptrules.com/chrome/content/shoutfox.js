var shoutFox = {
    request: function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = (function (req) {
            return function () {
                if (req.readyState < 4) {
                    return;
                }
                if (req.status === 200) {
                    callback(req.responseText);
                }
            }
        })(xhr);
        xhr.open('GET', url, true);
        xhr.send(null);
    },

    openURL: function (url) {
        var i, tab, browser, doc, loc,
            tabbrowser = gBrowser,
            tabs = tabbrowser.tabContainer.childNodes,
            len = tabs.length;

        for (i = 0; i < len; i += 1) {
            tab = tabs[i];
            try {
                browser = tabbrowser.getBrowserForTab(tab);
                if (browser) {
                    doc = browser.contentDocument;
                    loc = doc.location.toString();
                    if (loc === url) {
                        gBrowser.selectedTab = tab;
                        return;
                    }
                }
            } catch (ex) {
            }
        }

        // There is no tab. open new tab...
        tab = gBrowser.addTab(url, null, null);
        gBrowser.selectedTab = tab;
    },

    parseTeamUpdates: function (res) {
        var i, len, matches, posts, post, row, lbl,
            doc = document,
            reLogin = /<a href="(https:\/\/login\.yahoo\.com\/config\/login\?\.done[^>]+)">/im;

        // check for login
        matches = reLogin.exec(res);
        if (matches && matches[1]) {
            this.openURL(matches[1]);
            return;
        }

        shoutFox.box.removeChild(shoutFox.msg);

        // check for dashboard
        try {
            eval('res = (' + res + ');');
            posts = res.data.messages;
            for (i = 0, len = posts.length; i < len; i += 1) {
                post = posts[i];
                row = doc.createElement('hbox');
                shoutFox.box.appendChild(row);
                img = doc.createElement('img');
                img.setAttribute('src', '' + post.user + '.jpg');
                row.appendChild(img);
                lbl = doc.createElement('label');
                lbl.setAttribute('class', 'post');
                lbl.setAttribute('value', post.user + ': ' + post.text + ' - ' + post.time);
                row.appendChild(lbl);
            }
        } catch (ex) {
            alert(ex);
        }

        this.panelVisible = false;
    },

    load: function (e) {
        this.initialized = true;
        this.panelVisible = false;
    },

    togglePanel: function (e) {
        var button, lbl, panel, sts,
            doc = document;
        if (e.button === 0) {
            panel = doc.createElement('panel');
            panel.id = 'shoutfox-panel';

            this.box = doc.createElement('vbox');
            this.box.align = 'start';
            panel.appendChild(this.box);

            this.msg = doc.createElement('label');
            this.msg.setAttribute('class', 'msg');
            this.msg.setAttribute('value', 'loading...');
            this.box.appendChild(this.msg);

            var ctrls = doc.createElement('hbox');
            panel.appendChild(ctrls);

            var txt = doc.createElement('textbox');
            txt.setAttribute('value', 'testing');
            ctrls.appendChild(txt);

            var btn = doc.createElement('button');
            btn.setAttribute('label', 'post');
            ctrls.appendChild(btn);

            sts = doc.getElementById('status-bar');
            sts.parentNode.insertBefore(panel, sts);

            button = doc.getElementById('shoutfox-statusbar-button');
            panel.openPopup(button, 'before_end', 0, 0, false, false);
            this.request('http://shout.corp.yahoo.com/api/team/updates/46', this.parseTeamUpdates);
            //this.parseTeamUpdates('{"statuscode":1,"data":{"messages":[{"id":"8534","user":"tsunghan","text":"finish interview feedback - preparing slide for friday r3 presentation","team_id":"46","time":"1 hour ago"},{"id":"8533","user":"marcell","text":"attending performance meetup A3 yellostone","team_id":"46","time":"2 hours ago"},{"id":"8532","user":"fabiohh","text":"ok, now on php5.2. :)","team_id":"46","time":"2 hours ago"},{"id":"8531","user":"fabiohh","text":"ok, updating my box to php5.2...","team_id":"46","time":"3 hours ago"},{"id":"8530","user":"marcell","text":"removing srp features for arabic phase 1","team_id":"46","time":"5 hours ago"},{"id":"8529","user":"fabiohh","text":"looking at FR directory ...","team_id":"46","time":"7 hours ago"},{"id":"8528","user":"fabiohh","text":"","team_id":"46","time":"7 hours ago"},{"id":"8527","user":"marcell","text":"@Deep-dive logging\/tracking & bucket test methodology presentation","team_id":"46","time":"7 hours ago"},{"id":"8526","user":"rodcast","text":"Talking Sebastian and Wellin","teamser":"fabiohh","text":"ok, now on php5.2. :)","team_id":"46","time":"2 hours ago"},{"id":"8531","user":"fabiohh","text":"ok, updating my box to php5.2...","team_id":"46","time":"3 hours ago"}]}}');
        }
    },

    openDashboard: function () {
        this.openURL('http://shout.corp.yahoo.com/mine');
    },

    togglePopup: function () {
        alert('togglePopup: not implemented yet');
    },

    updatePosts: function () {
        alert('updatePosts: not implemented yet');
    },

    markAllRead: function () {
        alert('markAllRead: not implemented yet');
    },

    showPreferences: function () {
        if (this.prefWindow) {
          this.prefWindow.focus();
          return true;
        }
        this.prefWindow = window.openDialog("chrome://shoutfox/content/preferences.xul", 
                                             "_blank",
                                             "chrome,resizable=no,dependent=yes");
        return true;
    }
};

window.addEventListener('load', function (e) {shoutFox.load(e);}, false);
