﻿using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SST.Application.Common.Interfaces;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SST.Application.Subjects.Queries.GetSubjects
{
    public class GetSubjectsQueryHandler : IRequestHandler<GetSubjectsQuery, SubjectsListVm>
    {
        private readonly ISSTDbContext _context;
        private readonly IMapper _mapper;

        public GetSubjectsQueryHandler(ISSTDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<SubjectsListVm> Handle(GetSubjectsQuery request, CancellationToken cancellationToken)
        {
            var subjects = await _context.Subjects
               .ProjectTo<SubjectDto>(_mapper.ConfigurationProvider)
               .ToListAsync(cancellationToken);

            return new SubjectsListVm { Subjects = subjects };
        }
    }
}
