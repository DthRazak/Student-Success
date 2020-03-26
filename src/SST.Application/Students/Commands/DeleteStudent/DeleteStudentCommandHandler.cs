﻿using MediatR;
using SST.Application.Common.Interfaces;
using SST.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SST.Application.Students.Commands.DeleteStudent
{
    class DeleteStudentCommandHandler : IRequestHandler<DeleteStudentCommand, Unit>
    {
        private readonly ISSTDbContext _context;

        public DeleteStudentCommandHandler(ISSTDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DeleteStudentCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Students
                .FindAsync(request.Id);

            if (entity == null)
                throw new ArgumentException($"Student with Id({request.Id}) does not exists!");

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
