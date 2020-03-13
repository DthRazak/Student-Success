﻿using System.ComponentModel.DataAnnotations;

namespace SST.WebUI.Forms
{
    public class SignupForm
    {
        [Required(ErrorMessage = "Email not specified")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password not specified")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Passwords doesn't match")]
        public string ConfirmPassword { get; set; }

        [Required]
        public string Group { get; set; }

        [Required]
        public string FullName { get; set; }
    }
}
