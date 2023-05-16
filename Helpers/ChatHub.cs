using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TelnetTeamBack.Context;
using TelnetTeamBack.models;
using TelnetTeamBack.models.Dto;

namespace TelnetTeamBack.Helpers
{
    public class ChatHub : Hub
    {

        private readonly AppDbContext _context;

        public ChatHub(AppDbContext context)
        {
            _context = context;
        }


        //4Tutorial
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            int currUserId = _context.Connections.Where(c => c.SignalrId == Context.ConnectionId).Select(c => c.utilisateurId).SingleOrDefault();
            _context.Connections.RemoveRange(_context.Connections.Where(p => p.utilisateurId == currUserId).ToList());
            await _context.SaveChangesAsync();

            // Envoi de la réponse de déconnexion à l'utilisateur actuel et à tous les autres utilisateurs connectés
            Clients.Others.SendAsync("userOff", currUserId);
            await base.OnDisconnectedAsync(exception);
        }


        public async Task authMe(UserDto userDto)
        {
            string currSignalrID = Context.ConnectionId;
            Utilisateur utilisateur = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.Nom == userDto.Nom && u.MotDePasse == userDto.MotDePasse);

            if (utilisateur != null)
            {
                Connection conn = new Connection
                {
                    utilisateurId = utilisateur.id,
                    SignalrId = currSignalrID,
                    ConnectedAt = DateTime.Now
                };
                await _context.Connections.AddAsync(conn);
                await _context.SaveChangesAsync();

                List<User> onlineUsers = await GetOnlineUsers(utilisateur.id);
                await Clients.Caller.SendAsync("GetOnlineUsersResponse", onlineUsers);

                User newUser = new User(utilisateur.id, utilisateur.Nom, utilisateur.Prenom, currSignalrID);
                await Clients.Caller.SendAsync("authMeResponseSuccess", newUser);
                await Clients.Others.SendAsync("userOn", newUser);
            }
            else
            {
                await Clients.Caller.SendAsync("authMeResponseFail");
            }
        }



        ////3Tutorial
        //public async Task reauthMe(UserDto userDto)
        //{
        //    string currSignalrID = Context.ConnectionId;
        //    Utilisateur utilisateur = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.Nom == userDto.Nom && u.MotDePasse == userDto.MotDePasse);

        //    if (utilisateur != null)
        //    {
        //        Connection conn = new Connection
        //        {
        //            utilisateurId = utilisateur.id,
        //            SignalrId = currSignalrID,
        //            ConnectedAt = DateTime.Now
        //        };
        //        await _context.Connections.AddAsync(conn);
        //        await _context.SaveChangesAsync();

        //        User newUser = new User(utilisateur.id, utilisateur.Nom, utilisateur.Prenom, currSignalrID);
        //        await Clients.Caller.SendAsync("authMeResponseSuccess", newUser);
        //        await Clients.Others.SendAsync("userOn", newUser);
        //    }
        //} //end of reauthMe

        //public void logOut(int utilisateurId)
        //{
        //    _context.Connections.RemoveRange(_context.Connections.Where(p => p.utilisateurId == utilisateurId).ToList());
        //    _context.SaveChanges();
        //    Clients.Caller.SendAsync("logoutResponse");
        //    Clients.Others.SendAsync("userOff", utilisateurId);
        //}



        public async Task<List<User>> GetOnlineUsers(int currentUserId)
        {
            List<User> onlineUsers = _context.Connections
                .Where(c => c.utilisateurId != currentUserId)
                .Select(c => new User(c.utilisateurId, _context.Utilisateurs.Where(p => p.id == c.utilisateurId).Select(p => p.Nom).SingleOrDefault(), _context.Utilisateurs.Where(p => p.id == c.utilisateurId).Select(p => p.Prenom).SingleOrDefault(), c.SignalrId))
                .ToList();
            return onlineUsers;
        }



        public async Task sendMsg(string connId, string msg)
        {
            int currUserId = _context.Connections.Where(c => c.SignalrId == Context.ConnectionId).Select(c => c.utilisateurId).SingleOrDefault();
            Utilisateur sender = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.id == currUserId);

            Message newMessage = new Message
            {
                message = msg,
                date = DateTime.Now,
                senderId = currUserId,
                Sender = sender
            };

            await _context.Messages.AddAsync(newMessage);
            await _context.SaveChangesAsync();

            await Clients.Client(connId).SendAsync("newMsg", sender.Nom + " " + sender.Prenom, msg);
        }


    }
}
