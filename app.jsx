import { jsxDEV } from "react/jsx-dev-runtime";
const { useState, useEffect, useRef } = React;
function useWebsimSocket() {
  const [room, setRoom] = useState(null);
  const [peers, setPeers] = useState({});
  const [roomState, setRoomState] = useState({});
  const [presence, setPresence] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    const r = new WebsimSocket();
    async function init() {
      await r.initialize();
      setPeers(r.peers);
      setRoomState(r.roomState);
      setPresence(r.presence);
      setIsConnected(true);
      r.subscribePresence((p) => {
        setPresence(p);
        setPeers(r.peers);
      });
      r.subscribeRoomState((rs) => {
        setRoomState(rs);
      });
    }
    init();
    setRoom(r);
    return () => {
    };
  }, []);
  return { room, peers, roomState, presence, isConnected };
}
function CursorLayer({ room, peers, presence }) {
  const myId = room?.clientId;
  return /* @__PURE__ */ jsxDEV("div", { className: "cursor-container", children: Object.entries(peers).map(([clientId, peer]) => {
    if (clientId === myId) return null;
    const p = presence[clientId];
    if (!p || !p.cursorX) return null;
    return /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: "peer-cursor",
        style: { transform: `translate(${p.cursorX}px, ${p.cursorY}px)` },
        children: [
          /* @__PURE__ */ jsxDEV(
            "img",
            {
              src: peer.avatarUrl,
              alt: peer.username,
              className: "peer-avatar"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 65,
              columnNumber: 25
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "peer-label", children: peer.username }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 70,
            columnNumber: 25
          }, this)
        ]
      },
      clientId,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 60,
        columnNumber: 21
      },
      this
    );
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 53,
    columnNumber: 9
  }, this);
}
function SharedSwitch({ room, roomState }) {
  const isSwitched = roomState?.sharedSwitch || false;
  const lastToggledBy = roomState?.lastToggledBy || "Nobody";
  const toggle = () => {
    if (!room) return;
    room.updateRoomState({
      sharedSwitch: !isSwitched,
      lastToggledBy: room.peers[room.clientId].username
    });
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg mb-6", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-bold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDEV("i", { "data-lucide": "zap", className: "w-5 h-5 text-yellow-400" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 96,
          columnNumber: 21
        }, this),
        "Room State (Synchronized)"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 95,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: `w-3 h-3 rounded-full ${isSwitched ? "bg-green-500 ping-indicator" : "bg-red-500"}` }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 99,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 94,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("p", { className: "text-slate-400 text-sm mb-4", children: [
      "This switch state is stored in ",
      /* @__PURE__ */ jsxDEV("code", { children: "room.roomState" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 103,
        columnNumber: 48
      }, this),
      ". If anyone clicks it, it updates for everyone instantly."
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 102,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        onClick: toggle,
        className: `w-full py-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 ${isSwitched ? "bg-green-600 hover:bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "bg-slate-700 hover:bg-slate-600 text-slate-300"}`,
        children: isSwitched ? "SWITCH IS ON" : "SWITCH IS OFF"
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 106,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("div", { className: "text-center mt-2 text-xs text-slate-500", children: [
      "Last interaction: ",
      lastToggledBy
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 116,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 93,
    columnNumber: 9
  }, this);
}
function DatabaseGuestbook() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const collection = window.websim.collection("showcase_guestbook");
  useEffect(() => {
    const unsubscribe = collection.subscribe((records) => {
      setPosts(records);
    });
    setPosts(collection.getList());
    return () => unsubscribe();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      await collection.create({
        message: message.trim()
      });
      setMessage("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-800 flex flex-col h-full rounded-xl border border-slate-700 overflow-hidden", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "p-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-bold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDEV("i", { "data-lucide": "database", className: "w-5 h-5 text-blue-400" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 164,
          columnNumber: 21
        }, this),
        "Database (Persistent)"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 163,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-400 mt-1", children: "Data here survives page reloads. Records automatically include the author's username and avatar." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 167,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 162,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: [
      posts.length === 0 && /* @__PURE__ */ jsxDEV("div", { className: "text-center text-slate-500 py-8", children: "No entries yet. Be the first!" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 174,
        columnNumber: 21
      }, this),
      posts.map((post) => /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900/50 p-3 rounded-lg flex gap-3 animate-fade-in", children: [
        /* @__PURE__ */ jsxDEV(
          "img",
          {
            src: `https://images.websim.com/avatar/${post.username}`,
            className: "w-8 h-8 rounded-full border border-slate-700",
            alt: "avatar"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 180,
            columnNumber: 25
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-sm text-slate-200", children: post.username }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 187,
              columnNumber: 33
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-slate-500", children: new Date(post.created_at).toLocaleTimeString() }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 188,
              columnNumber: 33
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 186,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-slate-300 mt-1", children: post.message }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 190,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 185,
          columnNumber: 25
        }, this)
      ] }, post.id, true, {
        fileName: "<stdin>",
        lineNumber: 179,
        columnNumber: 21
      }, this))
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 172,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSubmit, className: "p-3 border-t border-slate-700 flex gap-2", children: [
      /* @__PURE__ */ jsxDEV(
        "input",
        {
          type: "text",
          value: message,
          onChange: (e) => setMessage(e.target.value),
          placeholder: "Sign the guestbook...",
          className: "flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 197,
          columnNumber: 17
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          disabled: submitting,
          className: "bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-bold disabled:opacity-50",
          children: "Post"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 204,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 196,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 161,
    columnNumber: 9
  }, this);
}
function InfoPanel() {
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-6 text-sm text-slate-300 leading-relaxed overflow-y-auto h-full pr-2", children: [
    /* @__PURE__ */ jsxDEV("section", { children: [
      /* @__PURE__ */ jsxDEV("h4", { className: "text-blue-400 font-bold mb-2 uppercase text-xs tracking-wider", children: "User Profiles" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 220,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "mb-2", children: [
        "In Websim, you ",
        /* @__PURE__ */ jsxDEV("strong", { children: "never" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 222,
          columnNumber: 36
        }, this),
        " need to build a login system."
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 221,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("ul", { className: "list-disc pl-4 space-y-1 text-slate-400", children: [
        /* @__PURE__ */ jsxDEV("li", { children: [
          /* @__PURE__ */ jsxDEV("strong", { children: "Realtime:" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 225,
            columnNumber: 25
          }, this),
          " ",
          /* @__PURE__ */ jsxDEV("code", { children: "room.peers[id]" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 225,
            columnNumber: 52
          }, this),
          " gives you ",
          /* @__PURE__ */ jsxDEV("code", { children: `{ username, avatarUrl }` }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 225,
            columnNumber: 90
          }, this),
          "."
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 225,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("li", { children: [
          /* @__PURE__ */ jsxDEV("strong", { children: "Database:" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 226,
            columnNumber: 25
          }, this),
          " Created records automatically attach ",
          /* @__PURE__ */ jsxDEV("code", { children: "username" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 226,
            columnNumber: 89
          }, this),
          ". Avatar images are available at ",
          /* @__PURE__ */ jsxDEV("code", { children: [
            "https://images.websim.com/avatar/$",
            "{username}"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 226,
            columnNumber: 143
          }, this),
          "."
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 226,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 224,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 219,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("section", { children: [
      /* @__PURE__ */ jsxDEV("h4", { className: "text-green-400 font-bold mb-2 uppercase text-xs tracking-wider", children: "Realtime (Ephemeral)" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 231,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "mb-2", children: [
        "Uses ",
        /* @__PURE__ */ jsxDEV("code", { children: "WebsimSocket" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 233,
          columnNumber: 26
        }, this),
        ". Great for things that change 60 times a second or don't need to be saved forever."
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 232,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900 p-2 rounded border border-slate-700 font-mono text-xs mb-2", children: [
        "room.updatePresence(",
        `{ x: 10, y: 10 }`,
        ");",
        /* @__PURE__ */ jsxDEV("br", {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 236,
          columnNumber: 63
        }, this),
        "// Updates YOUR cursor for others"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 235,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900 p-2 rounded border border-slate-700 font-mono text-xs", children: [
        "room.updateRoomState(",
        `{ switchOn: true }`,
        ");",
        /* @__PURE__ */ jsxDEV("br", {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 240,
          columnNumber: 66
        }, this),
        "// Updates world state for everyone"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 239,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 230,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("section", { children: [
      /* @__PURE__ */ jsxDEV("h4", { className: "text-purple-400 font-bold mb-2 uppercase text-xs tracking-wider", children: "Database (Persistent)" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 246,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "mb-2", children: [
        "Uses ",
        /* @__PURE__ */ jsxDEV("code", { children: "window.websim.collection()" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 248,
          columnNumber: 26
        }, this),
        ". Data is saved permanently."
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 247,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900 p-2 rounded border border-slate-700 font-mono text-xs", children: [
        "await collection.create(",
        `{ msg: "Hello" }`,
        ");"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 250,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 245,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 218,
    columnNumber: 9
  }, this);
}
function App() {
  const { room, peers, roomState, presence, isConnected } = useWebsimSocket();
  const [currentUser, setCurrentUser] = useState(null);
  const containerRef = useRef(null);
  useEffect(() => {
    window.websim.getCurrentUser().then(setCurrentUser);
    lucide.createIcons();
  }, []);
  const handleMouseMove = (e) => {
    if (!room) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    room.updatePresence({ cursorX: x, cursorY: y });
  };
  if (!isConnected) return /* @__PURE__ */ jsxDEV("div", { className: "h-screen w-full flex items-center justify-center text-slate-500 animate-pulse", children: "Connecting to Websim..." }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 284,
    columnNumber: 9
  }, this);
  return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col h-full max-w-6xl mx-auto p-4 gap-4", children: [
    /* @__PURE__ */ jsxDEV("header", { className: "flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h1", { className: "text-xl font-bold text-white", children: "SDK Showcase" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 295,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 mt-1", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 297,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-slate-400", children: [
            Object.keys(peers).length,
            " Peer(s) Online"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 298,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 296,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 294,
        columnNumber: 17
      }, this),
      currentUser && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3 bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-700/50", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "text-right hidden sm:block", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-slate-400", children: "Logged in as" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 305,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "font-bold text-sm text-blue-400", children: [
            "@",
            currentUser.username
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 306,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 304,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV(
          "img",
          {
            src: `https://images.websim.com/avatar/${currentUser.username}`,
            className: "w-10 h-10 rounded-full border-2 border-slate-700",
            alt: "Me"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 308,
            columnNumber: 25
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 303,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 293,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex flex-col md:flex-row gap-4 min-h-0", children: [
      /* @__PURE__ */ jsxDEV(
        "div",
        {
          ref: containerRef,
          className: "flex-1 bg-slate-800/50 rounded-xl border border-slate-700 relative overflow-hidden flex flex-col",
          onMouseMove: handleMouseMove,
          onTouchMove: (e) => {
            const touch = e.touches[0];
            handleMouseMove(touch);
          },
          children: [
            /* @__PURE__ */ jsxDEV(
              "div",
              {
                className: "absolute inset-0 opacity-5 pointer-events-none",
                style: { backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px" }
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 332,
                columnNumber: 21
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("div", { className: "p-4 relative z-10", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "inline-block bg-blue-600/20 text-blue-300 text-xs px-2 py-1 rounded mb-4 font-mono", children: "Interactive Zone (Move Cursor Here)" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 337,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV(SharedSwitch, { room, roomState }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 341,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "bg-slate-900/80 backdrop-blur p-4 rounded-lg border border-slate-700", children: [
                /* @__PURE__ */ jsxDEV("h3", { className: "font-bold text-white mb-2 text-sm flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxDEV("i", { "data-lucide": "info", className: "w-4 h-4" }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 345,
                    columnNumber: 33
                  }, this),
                  "How Presence Works"
                ] }, void 0, true, {
                  fileName: "<stdin>",
                  lineNumber: 344,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-slate-400 leading-relaxed", children: [
                  "Move your mouse/finger in this box. Your position is broadcast via",
                  /* @__PURE__ */ jsxDEV("span", { className: "text-blue-400 font-mono mx-1", children: "room.updatePresence()" }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 350,
                    columnNumber: 33
                  }, this),
                  ". Other users' cursors are rendered by reading",
                  /* @__PURE__ */ jsxDEV("span", { className: "text-green-400 font-mono mx-1", children: "room.presence" }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 352,
                    columnNumber: 33
                  }, this),
                  "."
                ] }, void 0, true, {
                  fileName: "<stdin>",
                  lineNumber: 348,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 343,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 336,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(CursorLayer, { room, peers, presence }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 358,
              columnNumber: 21
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 321,
          columnNumber: 17
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex flex-col gap-4 min-h-0", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex-1 min-h-[300px]", children: /* @__PURE__ */ jsxDEV(DatabaseGuestbook, {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 364,
          columnNumber: 25
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 363,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "h-1/3 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-inner", children: /* @__PURE__ */ jsxDEV(InfoPanel, {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 367,
          columnNumber: 25
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 366,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 362,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 318,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 290,
    columnNumber: 9
  }, this);
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 377,
  columnNumber: 13
}));
