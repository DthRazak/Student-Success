﻿using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SST.Application.Students.Queries.GetGroups;
using SST.WebUI.Forms;
using SST.WebUI.ViewModels;
using System.Text.Json;
using SST.Application.Students.Queries.GetNotLinkedStudentsByGroup;
using SST.Application.Lectors.Queries.GetNotLinkedLectors;
using SST.Application.Common.Interfaces;

namespace SST.WebUI.Controllers
{
    public class AccountController : Controller
    {
        private readonly ILogger<AccountController> _logger;
        private readonly IMediator _mediator;
        private readonly IAccountService _accountService;

        public AccountController(ILogger<AccountController> logger, IMediator mediator, IAccountService accountService)
        {
            _logger = logger;
            _mediator = mediator;
            _accountService = accountService;
        }

        [HttpGet]
        public async Task<IActionResult> Signup()
        {
            var groupList = await _mediator.Send(new GetGroupsQuery());
            var model = new SignupModel
            {
                GroupsList = groupList,
                StudentsList = await _mediator.Send(new GetNotLinkedStudentsByGroupQuery 
                                                        { Group = groupList.Groups.FirstOrDefault() }),
                StudentSignupForm = new StudentSignupForm(),
                LectorSignupForm = new LectorSignupForm()
            };
            return View(model);
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginForm form)
        {
            if (ModelState.IsValid)
            {
                ClaimsPrincipal claimsPrinciple;
                try
                {
                    claimsPrinciple = await _accountService.Login(
                        form.Email, form.Password);
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", ex.Message);
                    return View(form);
                }

                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimsPrinciple);

                return RedirectToAction("Info", claimsPrinciple.Claims.Single(c => c.Type == ClaimTypes.Role).Value);
            }
            return View(form);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SignupAsLector(LectorSignupForm form)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    await _accountService.CreateLectorAccount(form.Email, form.Password, form.LectorId);
                }
                catch (ArgumentException ex)
                {
                    ModelState.AddModelError("", ex.Message);
                }

                return RedirectToAction("Login", "Account");
            }

            var groupList = await _mediator.Send(new GetGroupsQuery());
            var model = new SignupModel
            {
                GroupsList = groupList,
                StudentsList = await _mediator.Send(new GetNotLinkedStudentsByGroupQuery
                { Group = groupList.Groups.FirstOrDefault() }),
                StudentSignupForm = new StudentSignupForm(),
                LectorSignupForm = form
            };

            return View("Signup", model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SignupAsStudent(StudentSignupForm form)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    await _accountService.CreateStudentAccount(form.Email, form.Password, form.StudentId);
                }
                catch (ArgumentException ex)
                {
                    ModelState.AddModelError("", ex.Message);
                }

                return RedirectToAction("Login", "Account");
            }

            var groupList = await _mediator.Send(new GetGroupsQuery());
            var model = new SignupModel
            {
                GroupsList = groupList,
                StudentsList = await _mediator.Send(new GetNotLinkedStudentsByGroupQuery
                { Group = groupList.Groups.FirstOrDefault() }),
                StudentSignupForm = form,
                LectorSignupForm = new LectorSignupForm()
            };

            return View("Signup", model);
        }

        [HttpGet]
        public async Task<string> GetStudentsByGroup(string group)
        {
            return JsonSerializer.Serialize(await _mediator.Send(new GetNotLinkedStudentsByGroupQuery { Group = group}));
        }

        [HttpGet]
        public async Task<string> GetLectors()
        {
            return JsonSerializer.Serialize(await _mediator.Send(new GetNotLinkedLectorsQuery()));
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login", "Account");
        }
    }
}
